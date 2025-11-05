import pandas as pd
import re
from collections import Counter
from sklearn.preprocessing import MultiLabelBinarizer, StandardScaler
from sklearn.neighbors import NearestNeighbors
import numpy as np
import math

# --------------------------------------------------------
# 1️⃣ 데이터 불러오기 및 컬럼명 변경
# --------------------------------------------------------
df = pd.read_excel("/content/drive/MyDrive/학교 수업/2025년 2학기/인공지능/취미 설문조사.xlsx")

df = df.rename(columns={
    "성별을 선택해주세요(*)": "gender",
    "연령대를 선택해주세요(*)": "age_group",
    "취미 활동을 선호하는 장소는 어디인가요?(*)": "preferred_place",
    "취미 활동 성향은 어떤 편인가요?(*)": "propensity",
    "취미 활동에 사용할 수 있는 월 예산은 어느 정도인가요?(*)": "budget",
    "현재 즐기고 있는 취미는 무엇인가요?(*)": "current_hobbies",
    "현재 어떤 취미 활동에 관심이 있나요?(*)": "interest_hobbies",  # ✅ 추가
    "취미를 즐기고 싶은 시간대는 언제인가요?(*)": "hobby_time",
    "하루에 취미 활동에 투자할 수 있는 시간은 얼마나 되나요?(*)": "time_per_day",
    "취미 활동 주기를 어느 정도로 하고 싶나요?(*)": "frequency",
    "취미 활동을 통해 얻고 싶은 것은 무엇인가요?(*)": "goal",
    "혼자 하는 취미 활동을 선호하시나요, 함께 하는 취미 활동을 선호하시나요?(*)": "sociality"
})

FEATURE_COLUMNS = [
    "gender", "age_group", "preferred_place", "propensity", "budget", "hobby_time",
    "time_per_day", "frequency", "goal", "sociality"
]

# --------------------------------------------------------
# 2️⃣ 전처리 헬퍼 함수
# --------------------------------------------------------
def split_multi(cell):
    if pd.isna(cell):
        return []
    parts = re.split(r'\s*\|\s*|\s*,\s*|\s*\/\s*|\s*;\s*|\n', str(cell))
    return [p.strip() for p in parts if p.strip()]


# --------------------------------------------------------
# 3️⃣ 취미명 정규화 (유사 항목 통합)
# --------------------------------------------------------
def normalize_hobby(hobby):
    hobby = hobby.strip().lower()

    mapping = {
        "헬스": ["헬스", "운동", "피트니스", "헬스장"],
        "러닝": ["러닝", "달리기", "조깅"],
        "수영": ["수영", "홈트", "운동"],
        "그림 그리기": ["그림", "그림그리기", "그림 그리기", "수채화그리기", "컬러링북하기", "디자인"],
        "게임": ["게임", "pc게임", "온라인 pc 게임"],
        "여행": ["여행", "산책", "공연 관람", "ott시청", "드라마/영화"],
        "필라테스": ["필라테스", "요가"],
        "독서": ["독서", "글쓰기", "책읽기"],
        "언어공부": ["언어공부", "영어공부", "프랑스어배우기"],
        "요리": ["요리", "베이킹"],
        "골프": ["골프"],
        "복싱": ["복싱"],
        "차박": ["차박", "캠핑"]
    }

    for key, synonyms in mapping.items():
        if hobby in synonyms:
            return key
    return hobby  # 매핑에 없으면 그대로 반환


def clean_hobby_list(hobby_list):
    return [normalize_hobby(h) for h in hobby_list if h.strip()]


# --------------------------------------------------------
# 4️⃣ 관심 취미 전처리
# --------------------------------------------------------
df["interest_hobbies_list"] = df["interest_hobbies"].apply(split_multi).apply(clean_hobby_list)

# --------------------------------------------------------
# 5️⃣ 범주형 변수 인코딩 (OHE + MultiLabel)
# --------------------------------------------------------
multi_cols = ['propensity', 'goal']
single_cols = [c for c in FEATURE_COLUMNS if c not in multi_cols]
fitted_mlbs = {}
df_multi_encoded_list = []

# Multi-choice OHE
for col in multi_cols:
    col_data = df[col].apply(lambda x: split_multi(x) if pd.notna(x) else [])
    mlb = MultiLabelBinarizer()
    df_encoded = pd.DataFrame(mlb.fit_transform(col_data), columns=[f'{col}_{c}' for c in mlb.classes_], index=df.index)
    df_multi_encoded_list.append(df_encoded)
    fitted_mlbs[col] = mlb

df_multi_encoded_final = pd.concat(df_multi_encoded_list, axis=1)

# Single-choice OHE
df_single_encoded = pd.get_dummies(df[single_cols], dummy_na=False, prefix=single_cols)

# 최종 feature dataset
df_ml = pd.concat([df_single_encoded, df_multi_encoded_final], axis=1)
df_ml = df_ml.fillna(0)

# --------------------------------------------------------
# 6️⃣ KNN 학습
# --------------------------------------------------------
X = df_ml.values
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

K = 10
model_knn = NearestNeighbors(n_neighbors=K, metric='cosine')
model_knn.fit(X_scaled)

# --------------------------------------------------------
# 7️⃣ 추천 함수
# --------------------------------------------------------
def recommend_hobbies_knn(user_answers, df_ml_train, df_raw, model_knn, scaler, top_n=5):
    def preprocess_user_for_knn(user_answers):
        new_user_single = pd.DataFrame([user_answers])[single_cols]
        new_user_single_encoded = pd.get_dummies(new_user_single).reindex(columns=df_single_encoded.columns, fill_value=0)

        new_user_multi_encoded = []
        for col in multi_cols:
            mlb = fitted_mlbs[col]
            input_value = user_answers.get(col, '')
            if pd.isna(input_value): input_value = ''
            encoded_array = mlb.transform([split_multi(input_value)])
            df_encoded = pd.DataFrame(encoded_array, columns=[f'{col}_{c}' for c in mlb.classes_])
            new_user_multi_encoded.append(df_encoded)

        new_user_multi_encoded_final = pd.concat(new_user_multi_encoded, axis=1)

        X_new_encoded = pd.concat([new_user_single_encoded.reset_index(drop=True),
                                   new_user_multi_encoded_final.reset_index(drop=True)], axis=1)
        return X_new_encoded[df_ml_train.columns].values

    X_new = preprocess_user_for_knn(user_answers)
    X_new_scaled = scaler.transform(X_new)
    distances, indices = model_knn.kneighbors(X_new_scaled)

    neighbor_indices = indices.flatten()
    neighbor_hobbies = df_raw.iloc[neighbor_indices]["interest_hobbies_list"].tolist()

    all_hobbies_from_neighbors = [hobby for sublist in neighbor_hobbies for hobby in sublist]
    hobby_counts = Counter(all_hobbies_from_neighbors)

    return hobby_counts.most_common(top_n)


# --------------------------------------------------------
# 8️⃣ 테스트 (사용자 예시 입력)
# --------------------------------------------------------
target_user = {
    "gender": "여성", "age_group": "20대 초·중반", "preferred_place": "상관없음",
    "propensity": "활동적 (운동, 여행, 몸을 움직이는 활동을 좋아함)",
    "budget": "저예산(5만 원 이하)", "hobby_time": "오후 (12:00 ~ 18:00)",
    "time_per_day": "~ 1시간", "frequency": "월 2~3회", "goal": "스트레스 해소",
    "sociality": "둘 다 가능"
}

print("사용자 응답:", target_user)
recs = recommend_hobbies_knn(target_user, df_ml, df, model_knn, scaler, top_n=5)
print("추천 취미:", [h for h, c in recs])
