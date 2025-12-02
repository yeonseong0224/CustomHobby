# ============================================================
# 📘 recommend_app.py (완성형)
# Flask + KNN 기반 취미 추천 API
# - React 설문 자동 정규화
# - Hobby ID 매핑
# - CORS 허용
# - 예외 처리 강화 및 로깅 일원화
# ============================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import re
from collections import Counter
from sklearn.preprocessing import MultiLabelBinarizer, StandardScaler
from sklearn.neighbors import NearestNeighbors

# ------------------------------------------------------------
# 1️⃣ Flask 설정
# ------------------------------------------------------------
app = Flask(__name__)
CORS(app)  # ✅ React / Spring 연동용 CORS 허용

# ------------------------------------------------------------
# 2️⃣ 데이터 불러오기 및 컬럼명 변경
# ------------------------------------------------------------
EXCEL_PATH = "취미 설문조사.xlsx"
print(f"📂 데이터 로드 중... ({EXCEL_PATH})")
df = pd.read_excel(EXCEL_PATH)

# ✅ 안전한 방식: 인덱스 기반 rename
# 엑셀 컬럼 순서: [응답일시, 참여자, 성별, 연령대, 장소, 성향, 투자시간, 주기, 시간대, 예산, 목적, 혼자/함께, 관심분야, 도전, 현재취미, 관심취미]
df = df.rename(columns={
    df.columns[2]: "gender",              # 3. 성별을 선택해주세요(*)
    df.columns[3]: "age_group",           # 4. 연령대를 선택해주세요(*)
    df.columns[4]: "preferred_place",     # 5. 취미 활동을 선호하는 장소는 어디인가요?(*)
    df.columns[5]: "propensity",          # 6. 취미 활동 성향은 어떤 편인가요?(*)
    df.columns[9]: "budget",              # 10. 취미 활동에 사용할 수 있는 월 예산은 어느 정도인가요?(*)
    df.columns[14]: "current_hobbies",    # 15. 현재 즐기고 있는 취미는 무엇인가요?(*)
    df.columns[15]: "interest_hobbies",   # 16. 현재 어떤 취미 활동에 관심이 있나요?(*)
    df.columns[8]: "hobby_time",          # 9. 취미를 즐기고 싶은 시간대는 언제인가요?(*)
    df.columns[6]: "time_per_day",        # 7. 하루에 취미 활동에 투자할 수 있는 시간은 얼마나 되나요?(*)
    df.columns[7]: "frequency",           # 8. 취미 활동 주기를 어느 정도로 하고 싶나요?(*)
    df.columns[10]: "goal",               # 11. 취미 활동을 통해 얻고 싶은 것은 무엇인가요?(*)
    df.columns[11]: "sociality"           # 12. 혼자 하는 취미 활동을 선호하시나요, 함께 하는 취미 활동을 선호하시나요?(*)
})

# ✅ 디버깅: rename 후 컬럼 확인
print("\n✅ rename 후 컬럼 목록:")
print(list(df.columns))
print(f"\n✅ interest_hobbies 존재 여부: {'interest_hobbies' in df.columns}")

FEATURE_COLUMNS = [
    "gender", "age_group", "preferred_place", "propensity", "budget",
    "hobby_time", "time_per_day", "frequency", "goal", "sociality"
]

# ------------------------------------------------------------
# 3️⃣ 전처리 함수
# ------------------------------------------------------------
def split_multi(cell):
    if pd.isna(cell):
        return []
    parts = re.split(r'\s*\|\s*|\s*,\s*|\s*\/\s*|\s*;\s*|\n', str(cell))
    return [p.strip() for p in parts if p.strip()]

def normalize_hobby(hobby):
    hobby = hobby.strip().lower()
    mapping = {
        "헬스": ["운동", "피트니스", "헬스장", "헬스"],
        "러닝": ["달리기", "조깅", "러닝"],
        "그림 그리기": ["그림", "수채화그리기", "컬러링북하기", "그림그리기"],
        "여행": ["산책", "캠핑", "차박", "여행"],
        "독서": ["책읽기", "독서"],
        "요리": ["베이킹", "요리"],
        "게임": ["게임", "pc게임"],
    }
    for key, synonyms in mapping.items():
        if hobby in synonyms:
            return key
    return hobby

def clean_hobby_list(hobby_list):
    return [normalize_hobby(h) for h in hobby_list if h.strip()]

# ------------------------------------------------------------
# 4️⃣ 데이터 전처리
# ------------------------------------------------------------
# ✅ 안전한 컬럼 접근
if "interest_hobbies" not in df.columns:
    print("❌ 에러: interest_hobbies 컬럼을 찾을 수 없습니다!")
    print(f"현재 컬럼 목록: {list(df.columns)}")
    raise KeyError("interest_hobbies 컬럼이 없습니다. 위의 컬럼 목록을 확인하세요.")

df["interest_hobbies_list"] = df["interest_hobbies"].apply(split_multi).apply(clean_hobby_list)

# ------------------------------------------------------------
# 5️⃣ 범주형 인코딩
# ------------------------------------------------------------
multi_cols = ['propensity', 'goal']
single_cols = [c for c in FEATURE_COLUMNS if c not in multi_cols]
fitted_mlbs = {}
df_multi_encoded_list = []

for col in multi_cols:
    col_data = df[col].apply(lambda x: split_multi(x) if pd.notna(x) else [])
    mlb = MultiLabelBinarizer()
    df_encoded = pd.DataFrame(mlb.fit_transform(col_data),
                              columns=[f'{col}_{c}' for c in mlb.classes_], index=df.index)
    df_multi_encoded_list.append(df_encoded)
    fitted_mlbs[col] = mlb

df_multi_encoded_final = pd.concat(df_multi_encoded_list, axis=1)
df_single_encoded = pd.get_dummies(df[single_cols], dummy_na=False, prefix=single_cols)
df_ml = pd.concat([df_single_encoded, df_multi_encoded_final], axis=1).fillna(0)

# ------------------------------------------------------------
# 6️⃣ KNN 모델 학습
# ------------------------------------------------------------
X = df_ml.values
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
model_knn = NearestNeighbors(n_neighbors=10, metric='cosine')
model_knn.fit(X_scaled)
print("✅ KNN 모델 학습 완료")

# ------------------------------------------------------------
# 7️⃣ React 설문 → 정규화 매핑
# ------------------------------------------------------------
def normalize_input_value(key, value):
    mapping = {
        "age_group": {
            "10대": "10대",
            "20대 초·중반": "20대",
            "20대 후반": "20대",
            "30대": "30대",
            "40·50대 이상": "40대 이상",
        },
        "preferred_place": {
            "실내": "실내에서 조용히 하는 걸 좋아해요",
            "실외": "밖에서 하는 걸 좋아해요",
            "상관없음": "장소에 크게 구애받지 않아요",
        },
        "propensity": {
            "창의적": "창의적이고 감성적인 편이에요",
            "활동적": "활동적인 편이에요",
            "정적인": "조용하고 차분한 편이에요",
            "사교적인": "상황에 따라 달라요",
        },
        "time_per_day": {
            "30분": "30분 이하",
            "1시간": "1시간 이하",
            "2시간": "1~2시간",
            "3시간 이상": "2시간 이상",
            "상관없음": "1시간 이하",
        },
        "frequency": {
            "매일": "매일",
            "주 2~3회": "주 3회 이하",
            "주 1회": "주 3회 이하",
            "월 2~3회": "불규칙하게 하고 싶어요",
            "가끔": "불규칙하게 하고 싶어요",
        },
        "hobby_time": {
            "새벽": "오전",
            "오전": "오전",
            "오후": "오후",
            "저녁": "저녁",
            "상관없음": "주말 중심",
        },
        "budget": {
            "무예산 (0원)": "5만원 이하",
            "저예산 (~5만원)": "5만원 이하",
            "중간 (5~15만원)": "5만원 ~ 10만원",
            "고예산 (15만원~)": "10만원 이상",
            "상관없음": "5만원 이하",
        },
        "goal": {
            "스트레스 해소": "스트레스 해소 및 힐링",
            "자기계발": "자기계발",
            "사회적 교류": "사람들과의 교류",
            "건강관리": "성취감과 만족감",
        },
        "sociality": {
            "혼자": "혼자 하는 걸 선호해요",
            "함께": "함께 하는 걸 선호해요",
            "상관없음": "상황에 따라 달라요",
        },
    }
    return mapping.get(key, {}).get(value, value)

# ------------------------------------------------------------
# 8️⃣ Hobby ID 매핑
# ------------------------------------------------------------
hobby_id_map = {
    1: "그림 그리기", 2: "캘리그래피", 3: "사진 촬영", 4: "기타 연주", 5: "피아노 연주",
    6: "요가", 7: "필라테스", 8: "헬스", 9: "러닝", 10: "수영", 11: "하이킹", 12: "자전거 타기",
    13: "차박", 14: "여행", 15: "골프", 16: "복싱", 17: "요리", 18: "베이킹", 19: "커피 브루잉",
    20: "독서", 21: "언어 공부", 22: "뜨개질", 23: "보석십자수", 24: "퍼즐 맞추기", 25: "게임",
    26: "OTT 감상", 27: "영화 보기", 28: "음악 감상", 29: "연극 관람", 30: "콘서트 관람",
    31: "야구 관람", 32: "축구 관람", 33: "풋살", 34: "배드민턴", 35: "클라이밍",
    36: "요리 클래스", 37: "디자인", 38: "악기 연주", 39: "캠핑", 40: "등산",
    41: "홈트레이닝", 42: "자기계발", 43: "드로잉", 44: "서예", 45: "연주회 감상"
}

# ------------------------------------------------------------
# 9️⃣ 추천 함수
# ------------------------------------------------------------
def recommend_hobbies_knn(user_answers, df_ml_train, df_raw, model_knn, scaler, top_n=5):
    def preprocess_user_for_knn(user_answers):
        new_user_single = pd.DataFrame([user_answers])[single_cols]
        new_user_single_encoded = pd.get_dummies(new_user_single).reindex(columns=df_single_encoded.columns, fill_value=0)

        new_user_multi_encoded = []
        for col in multi_cols:
            mlb = fitted_mlbs[col]
            input_value = user_answers.get(col, "")
            if pd.isna(input_value):
                input_value = ""
            encoded_array = mlb.transform([split_multi(input_value)])
            df_encoded = pd.DataFrame(encoded_array, columns=[f"{col}_{c}" for c in mlb.classes_])
            new_user_multi_encoded.append(df_encoded)

        new_user_multi_encoded_final = pd.concat(new_user_multi_encoded, axis=1)
        X_new_encoded = pd.concat(
            [new_user_single_encoded.reset_index(drop=True),
             new_user_multi_encoded_final.reset_index(drop=True)], axis=1)
        return X_new_encoded[df_ml_train.columns].values

    X_new = preprocess_user_for_knn(user_answers)
    X_new_scaled = scaler.transform(X_new)
    distances, indices = model_knn.kneighbors(X_new_scaled)
    neighbor_indices = indices.flatten()

    neighbor_hobbies = df_raw.iloc[neighbor_indices]["interest_hobbies_list"].tolist()
    all_hobbies = [h for sublist in neighbor_hobbies for h in sublist]
    hobby_counts = Counter(all_hobbies)
    return hobby_counts.most_common(top_n)

# ------------------------------------------------------------
# 🔟 Flask API
# ------------------------------------------------------------
@app.route("/")
def home():
    return "🎯 Flask Hobby Recommendation API is running!"

@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        user_data = request.get_json()
        print("✅ 받은 사용자 응답:", user_data)

        normalized_data = {k: normalize_input_value(k, v) for k, v in user_data.items()}
        print("🔄 정규화된 응답:", normalized_data)

        recs = recommend_hobbies_knn(normalized_data, df_ml, df, model_knn, scaler, top_n=5)
        result_names = [h for h, _ in recs]

        # 이름 → ID 매핑
        name_to_id = {v: k for k, v in hobby_id_map.items()}
        result_ids = [name_to_id.get(name) for name in result_names if name in name_to_id]

        print(f"🎯 최종 추천 결과: {result_names} → IDs: {result_ids}")

        return jsonify({
            "recommended_ids": result_ids,
            "recommended_hobbies": result_names
        })
    except Exception as e:
        print("❌ 오류 발생:", e)
        return jsonify({"error": str(e)}), 500

# ------------------------------------------------------------
# 🔟 서버 실행
# ------------------------------------------------------------
if __name__ == "__main__":
    print("🚀 Flask Hobby Recommendation Server Started! (정규화 + ID 매핑 + CORS Enabled)")
    app.run(host="0.0.0.0", port=5000)