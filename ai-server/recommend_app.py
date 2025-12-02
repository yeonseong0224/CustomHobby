# ============================================================
# (Deep Autoencoder 추론)
# ============================================================

# ============================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras import backend as K

def focal_loss_custom(gamma=2., alpha=0.25):
    def focal_loss_fixed(y_true, y_pred):
        y_true = tf.cast(y_true, tf.float32)
        y_pred = tf.cast(y_pred, tf.float32)
        epsilon = K.epsilon()
        y_pred = K.clip(y_pred, epsilon, 1. - epsilon)
        pt_1 = tf.where(tf.equal(y_true, 1), y_pred, tf.ones_like(y_pred))
        pt_0 = tf.where(tf.equal(y_true, 0), y_pred, tf.zeros_like(y_pred))
        return -K.sum(alpha * K.pow(1. - pt_1, gamma) * K.log(pt_1)) - K.sum((1-alpha) * K.pow(pt_0, gamma) * K.log(1. - pt_0))
    return focal_loss_fixed


# ------------------------------------------------------------
# 1. Flask 설정
# ------------------------------------------------------------
app = Flask(__name__)
CORS(app)

# ------------------------------------------------------------
# 2. 파일 경로 설정
# ------------------------------------------------------------
MODEL_FILE = "hobby_autoencoder.keras"
ASSETS_FILE = "model_assets.pkl"

# 전역 변수
autoencoder = None
model_assets = None

# ------------------------------------------------------------
# 3. Hobby ID 매핑 (DB 연동용)
# ------------------------------------------------------------
hobby_id_map = {
    1: "그림 그리기", 2: "캘리그래피", 3: "사진 촬영", 4: "기타 연주", 5: "피아노 연주",
    6: "요가", 7: "필라테스", 8: "헬스", 9: "러닝", 10: "수영", 12: "자전거 타기",
    13: "차박", 14: "여행", 15: "골프", 16: "복싱", 17: "요리", 18: "베이킹", 19: "커피 브루잉",
    20: "독서", 21: "언어 공부", 22: "뜨개질", 23: "보석십자수", 24: "퍼즐 맞추기", 25: "게임",
    26: "OTT 감상", 27: "영화 보기", 28: "음악 감상", 29: "연극 관람", 30: "콘서트 관람",
    31: "야구 관람", 32: "축구 관람", 33: "풋살", 34: "배드민턴", 35: "클라이밍",
    36: "요리 클래스", 37: "디자인", 38: "악기 연주", 39: "캠핑", 40: "등산",
    41: "홈트레이닝", 42: "자기계발", 43: "드로잉", 45: "연주회 감상"
}
name_to_id = {v: k for k, v in hobby_id_map.items()}

# ------------------------------------------------------------
# 4. 입력값 정규화 함수
# ------------------------------------------------------------
def normalize_input_value(key, value):
    """
    코랩 4번 셀과 동일한 매핑 (필수!)
    """
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
            "저예산": "5만원 이하",
            "중간 (5~15만원)": "5만원 ~ 10만원",
            "중간": "5만원 ~ 10만원",
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

    # 매핑에 없으면 원본 반환
    return mapping.get(key, {}).get(value, value)




# ------------------------------------------------------------
# 5. 모델 로드 함수
# ------------------------------------------------------------
def load_model_files():
    global autoencoder, model_assets
    
    print("\n[로딩 시작] 모델 불러오는 중...")
    
    try:
        # 1. Keras 모델 로드
        if os.path.exists(MODEL_FILE):
            custom_objects = {'focal_loss_fixed': focal_loss_custom(gamma=2.0, alpha=0.25)}
            autoencoder = load_model(MODEL_FILE, custom_objects=custom_objects)

            print(f"모델 로드 성공: {MODEL_FILE}")
        else:
            print(f"모델 파일 없음: {MODEL_FILE}")
            return
        
        # 2. 전처리 도구 + Threshold 로드
        if os.path.exists(ASSETS_FILE):
            with open(ASSETS_FILE, 'rb') as f:
                model_assets = pickle.load(f)
            print(f"전처리 도구 로드 성공: {ASSETS_FILE}")
            print(f"   학습 정보: {model_assets.get('info', {})}")
            print(f"   Threshold: {model_assets.get('optimal_threshold', 0.5):.3f}")
        else:
            print(f"PKL 파일 없음: {ASSETS_FILE}")
            return
            
        print("=" * 60)
        print("모델 준비 완료 Threshold 기반 추론 활성화")
        print("=" * 60)
        
    except Exception as e:
        print(f"로드 실패: {e}")

# ------------------------------------------------------------
# 6. 추천 함수 개선 (Threshold 기반)
# ------------------------------------------------------------
def recommend_hobbies_improved(user_answers, min_recommendations=3, max_recommendations=10):

    if not autoencoder or not model_assets:
        print("[ERROR] 모델이 로드되지 않았습니다.")
        return []
    
    # 1. pkl에서 필요한 도구 꺼내기
    feature_columns = model_assets['feature_columns']
    scaler = model_assets['scaler']
    hobby_labels = model_assets['hobby_labels']
    optimal_threshold = model_assets.get('optimal_threshold', 0.5)
    
    # 2. 사용자 입력 → One-Hot Encoding
    user_df = pd.DataFrame([user_answers])
    user_encoded = pd.get_dummies(user_df)
    
    # 3. 학습 때와 동일한 컬럼 순서로 맞추기
    X_input = user_encoded.reindex(columns=feature_columns, fill_value=0).values
    
        
    # 4. 먼저 user features만 스케일링 (41개)
    X_input_scaled = scaler.transform(X_input)

    # 5. 가중치 적용 (propensity에만 약간)
    weights = {
        'propensity': 2.5,  # 성향에만 조금 가중치
        'budget' : 1.5,
        'default': 1.0
    }

    num_user_features = len(feature_columns)
    for i, col in enumerate(feature_columns):
        if i >= num_user_features:
            break
        w = weights['propensity'] if 'propensity' in col else weights['default']
        X_input_scaled[0, i] *= w

    # 6. Zero Padding (취미 부분)
    dummy_hobbies = np.zeros((1, len(hobby_labels)))

    # 7. 스케일링된 user features + zero hobbies 결합
    full_input_scaled = np.hstack([X_input_scaled, dummy_hobbies])

    # 8. 오토인코더 예측
    reconstructed = autoencoder.predict(full_input_scaled, verbose=0)

    # 9. 뒷부분(취미 파트)만 추출
    predicted_scores = reconstructed[0, -len(hobby_labels):]
    
    # 10. Threshold 기반 필터링
    hobby_score_pairs = [
        (label, float(score)) 
        for label, score in zip(hobby_labels, predicted_scores)
        if score >= optimal_threshold  # Threshold 이상만 선택
    ]
    
    # 11. 점수 순 정렬
    hobby_score_pairs.sort(key=lambda x: x[1], reverse=True)
    
    # 12. 최소/최대 개수 보장
    if len(hobby_score_pairs) < min_recommendations:
        # Threshold 이하지만 상위 N개 추가
        all_hobbies = sorted(
            [(label, float(score)) for label, score in zip(hobby_labels, predicted_scores)],
            key=lambda x: x[1],
            reverse=True
        )
        hobby_score_pairs = all_hobbies[:min_recommendations]
    
    # 최대 개수 제한
    hobby_score_pairs = hobby_score_pairs[:max_recommendations]
    
    # 13. Confidence를 0~100 스케일로 변환
    # 260줄 부분을 이렇게 변경
    results = []
    for hobby, score in hobby_score_pairs:
        # Sigmoid로 0~1 범위로 변환 후 100 곱하기
        normalized = 1 / (1 + np.exp(-10 * (score - 0.5)))
        confidence = round(normalized * 100, 1)
        results.append((hobby, max(confidence, 1.0)))
    
    return results

# ------------------------------------------------------------
# 7. API 라우트
# ------------------------------------------------------------
@app.route("/")
def home():
    status = "active" if autoencoder else "inactive"
    threshold = model_assets.get('optimal_threshold', 'N/A') if model_assets else 'N/A'
    
    return jsonify({
        "status": status,
        "model": "Improved Deep Autoencoder (Threshold-based)",
        "threshold": float(threshold) if isinstance(threshold, (int, float)) else threshold,
        "hobbies_count": len(model_assets['hobby_labels']) if model_assets else 0
    })

@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        user_data = request.get_json()
        if not user_data:
            return jsonify({"error": "No data provided"}), 400
        
        print(f"[요청 받음] {user_data}")
        
        # 필수 필드 체크
        required_fields = [
            "gender", "age_group", "preferred_place", "propensity", 
            "budget", "hobby_time", "time_per_day", "frequency", 
            "goal", "sociality"
        ]
        
        # 모든 필드가 비어있으면 빈 결과 반환
        is_empty = True
        for field in required_fields:
            val = user_data.get(field)
            if val and str(val).strip() != "":
                is_empty = False
                break
        
        if is_empty:
            return jsonify({
                "recommended_ids": [],
                "recommended_hobbies": [],
                "confidence": []
            })
        
        # 입력값 정규화
        #normalized = {k: normalize_input_value(k, v) for k, v in user_data.items()}

        
        
        # 개선된 추천 실행 (Threshold 기반)
        #recs = recommend_hobbies_improved(normalized, min_recommendations=5, max_recommendations=10)
        
        # 정규화 없이 원본 데이터를 그대로 모델에 넣음
        print(f"[입력 데이터 그대로 사용] {user_data}")
        recs = recommend_hobbies_improved(user_data, min_recommendations=5, max_recommendations=10)
        
        # 결과 파싱
        hobby_names = [h[0] for h in recs]
        hobby_probs = [h[1] for h in recs]
        hobby_ids = [name_to_id.get(h, 0) for h in hobby_names]
        
        print(f"[추천 결과] {hobby_names[:5]}")  # 상위 5개만 로그
        print(f"[Confidence] {hobby_probs[:5]}")
        
        return jsonify({
            "recommended_ids": hobby_ids,
            "recommended_hobbies": hobby_names,
            # "confidence": hobby_probs
        })
    
    except Exception as e:
        print(f"[오류 발생] {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ------------------------------------------------------------
# 8. 서버 실행
# ------------------------------------------------------------
if __name__ == "__main__":
    # 서버 시작 전에 모델 로드
    load_model_files()
    
    print("\n" + "=" * 60)
    print("🚀 Flask 서버 시작 (개선된 Threshold 기반 추론)")
    print("=" * 60)
    
    app.run(host="0.0.0.0", port=5000, debug=False)

