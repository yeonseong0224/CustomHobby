# ============================================================
# recommend_app.py (LightGBM 기반 최종 완성형)
# Flask + LightGBM Multi-label 취미 추천 API
# - KNN 완전 제거
# - 45개 취미 MultiLabel 확률 기반 추천
# - React 설문 정규화 매핑 유지
# - 입력 검증 및 예외 처리 강화
# ============================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import re
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import train_test_split
import lightgbm as lgb

# ------------------------------------------------------------
# 1️. Flask 설정
# ------------------------------------------------------------
app = Flask(__name__)
CORS(app)

# ------------------------------------------------------------
# 2️. 데이터 불러오기
# ------------------------------------------------------------
EXCEL_PATH = "취미 설문조사.xlsx"
print(f"데이터 로드 중... ({EXCEL_PATH})")
df = pd.read_excel(EXCEL_PATH)

df = df.rename(columns={
    "성별을 선택해주세요(*)": "gender",
    "연령대를 선택해주세요(*)": "age_group",
    "취미 활동을 선호하는 장소는 어디인가요?(*)": "preferred_place",
    "취미 활동 성향은 어떤 편인가요?(*)": "propensity",
    "취미 활동에 사용할 수 있는 월 예산은 어느 정도인가요?(*)": "budget",
    "현재 즐기고 있는 취미는 무엇인가요?(*)": "current_hobbies",
    "현재 어떤 취미 활동에 관심이 있나요?(*)": "interest_hobbies",
    "취미를 즐기고 싶은 시간대는 언제인가요?(*)": "hobby_time",
    "하루에 취미 활동에 투자할 수 있는 시간은 얼마나 되나요?(*)": "time_per_day",
    "취미 활동 주기를 어느 정도로 하고 싶나요?(*)": "frequency",
    "취미 활동을 통해 얻고 싶은 것은 무엇인가요?(*)": "goal",
    "혼자 하는 취미 활동을 선호하시나요, 함께 하는 취미 활동을 선호하시나요?(*)": "sociality"
})

FEATURE_COLUMNS = [
    "gender", "age_group", "preferred_place", "propensity", "budget",
    "hobby_time", "time_per_day", "frequency", "goal", "sociality"
]

# ------------------------------------------------------------
# 3️. 전처리 함수
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
        "축구 관람": ["축구보기", "축구 관람"],
        "야구 관람": ["야구보기", "야구 관람","야구 직관"],
        "음악 감상": ["음악 감상 및 찾기"],
        "OTT 감상" : ["ott 감상"]

    }
    for key, synonyms in mapping.items():
        if hobby in synonyms:
            return key
    return hobby

df["interest_hobbies_list"] = (
    df["interest_hobbies"]
    .apply(split_multi)
    .apply(lambda lst: [normalize_hobby(h) for h in lst])
)

# ------------------------------------------------------------
# 4️. MultiLabelBinarizer로 취미 멀티라벨 변환
# ------------------------------------------------------------
mlb = MultiLabelBinarizer()
y_multi = mlb.fit_transform(df["interest_hobbies_list"])

HOBBY_LABELS = list(mlb.classes_)

# ------------------------------------------------------------
# 5️. 범주형 특징 인코딩
# ------------------------------------------------------------
df_encoded = pd.get_dummies(df[FEATURE_COLUMNS], dummy_na=False)
X = df_encoded.values

# ------------------------------------------------------------
# 6️. LightGBM 멀티라벨 모델 학습
# ------------------------------------------------------------
print("LightGBM 모델 학습 중... (45개 취미 확률 예측)")

lgb_models = {}
params = {
    "objective": "binary",
    "learning_rate": 0.06,
    "metric": "binary_logloss",
    "num_leaves": 31,
    "verbose": -1
}

for idx, hobby in enumerate(HOBBY_LABELS):
    y_label = y_multi[:, idx]
    train_data = lgb.Dataset(X, label=y_label)

    model = lgb.train(params, train_data, num_boost_round=150)
    lgb_models[hobby] = model

print("LightGBM Multi-label 모델 학습 완료!")

# ------------------------------------------------------------
# 7️. React 설문 → 정규화 매핑
# ------------------------------------------------------------
def normalize_input_value(key, value):
    mapping = {
        "age_group": {
            "10대": "10대", "20대 초·중반": "20대", "20대 후반": "20대",
            "30대": "30대", "40·50대 이상": "40대 이상",
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
            "30분": "30분 이하", "1시간": "1시간 이하",
            "2시간": "1~2시간", "3시간 이상": "2시간 이상",
            "상관없음": "1시간 이하",
        },
        "frequency": {
            "매일": "매일", "주 2~3회": "주 3회 이하",
            "주 1회": "주 3회 이하", "월 2~3회": "불규칙하게 하고 싶어요",
            "가끔": "불규칙하게 하고 싶어요",
        },
        "hobby_time": {
            "새벽": "오전", "오전": "오전", "오후": "오후", "저녁": "저녁",
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
# 8️. Hobby ID 매핑
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

name_to_id = {v: k for k, v in hobby_id_map.items()}

# ------------------------------------------------------------
# 9. LightGBM 추천 함수
# ------------------------------------------------------------
def recommend_hobbies_lgbm(user_answers, top_n=5):
    # 1) 입력값 인코딩
    user_df = pd.DataFrame([user_answers])
    user_encoded = pd.get_dummies(user_df).reindex(columns=df_encoded.columns, fill_value=0)
    X_new = user_encoded.values

    # 2) 취미별 확률 계산
    hobby_probs = {}
    for hobby in HOBBY_LABELS:
        prob = lgb_models[hobby].predict(X_new)[0]
        hobby_probs[hobby] = round(float(prob), 4)

    # 3) 확률 상위 N개 추출
    sorted_hobbies = sorted(hobby_probs.items(), key=lambda x: x[1], reverse=True)
    top_hobbies = sorted_hobbies[:top_n]

    return top_hobbies

# ------------------------------------------------------------
# 10. API Routing
# ------------------------------------------------------------
@app.route("/")
def home():
    return "LightGBM 기반 취미 추천 API 작동 중"

@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        user_data = request.get_json()
        print("입력값:", user_data)


# --------------------------------------
# 모든 필수 설문 항목이 비어있는지 확인
# --------------------------------------
        required_fields = ["gender", "age_group", "preferred_place", "propensity",
                   "budget", "hobby_time", "time_per_day", "frequency",
                   "goal", "sociality"]
        
        if not user_data or all(
            user_data.get(field,"") in["", None] for field in required_fields
        ):
            print("설문 데이터 없음 또는 미완료 - 빈 추천 반환")
            return jsonify({"recommended_ids":[], "recommended_hobbies":[]}),200
        
        normalized = {k:normalize_input_value(k,v) for k, v in user_data.items()}
        recs = recommend_hobbies_lgbm(normalized, top_n=5)

        hobby_names = [h[0] for h in recs]
        hobby_ids = [name_to_id.get(h) for h in hobby_names]

        print("최종 추천:", hobby_names)

        return jsonify({
            "recommended_ids": hobby_ids,
            "recommended_hobbies": hobby_names
        })

    except Exception as e:
        print("오류:", e)
        return jsonify({"error": str(e)}), 500

# ------------------------------------------------------------
# 서버 실행
# ------------------------------------------------------------
if __name__ == "__main__":
    print("Flask + LightGBM 취미 추천 서버 시작!")
    app.run(host="0.0.0.0", port=5000)
