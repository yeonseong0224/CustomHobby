# 📡 CustomHobby API 문서

## 🌐 Base URL

| 환경 | URL |
|------|-----|
| Local | `http://localhost:8080` |
| Production | `https://your-backend.fly.dev` |
| AI Server | `https://customhobby.onrender.com` |

---

## 👤 User API (`/api/users`)

### 1. 회원가입
```http
POST /api/users/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "testuser",
  "password": "password123",
  "email": "test@example.com",
  "nickname": "테스터",
  "age": 25,
  "region": "서울"
}
```

**Response:**
```json
{
  "userId": "testuser",
  "email": "test@example.com",
  "nickname": "테스터",
  "age": 25,
  "region": "서울",
  "createdAt": "2024-12-10T10:30:00"
}
```

---

### 2. 로그인
```http
POST /api/users/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "userId": "testuser",
  "email": "test@example.com",
  "nickname": "테스터",
  "age": 25,
  "region": "서울"
}
```

---

### 3. 사용자 정보 조회
```http
GET /api/users/{userId}
```

**Response:**
```json
{
  "userId": "testuser",
  "email": "test@example.com",
  "nickname": "테스터",
  "age": 25,
  "region": "서울",
  "profile": "base64_image_string",
  "introduce": "안녕하세요!",
  "phoneNum": "010-1234-5678"
}
```

---

### 4. 아이디 중복 체크
```http
GET /api/users/check/{userId}
```

**Response:**
```json
true  // 사용 가능
false // 중복
```

---

### 5. 프로필 업데이트
```http
PUT /api/users/{userId}/profile
Content-Type: application/json
```

**Request Body:**
```json
{
  "introduce": "새로운 자기소개입니다.",
  "profile": "base64_encoded_image_string",
  "phoneNum": "010-9876-5432"
}
```

---

### 6. 사용자 정보 수정
```http
PUT /api/users/{userId}
Content-Type: application/json
```

**Request Body:**
```json
{
  "nickname": "새닉네임",
  "region": "부산",
  "age": 26,
  "phoneNum": "010-1111-2222"
}
```

---

## 🎨 Hobby API (`/api/hobbies`)

### 1. 취미 생성
```http
POST /api/hobbies
Content-Type: application/json
```

**Request Body:**
```json
{
  "hobbyName": "요가",
  "hobbyCategory": "운동/건강",
  "description": "요가 수업입니다.",
  "oneLineDescription": "몸과 마음의 균형",
  "meetingType": "offline",
  "locationLink": "서울시 강남구",
  "meetingDate": "2024-12-15",
  "participationFee": 10000,
  "materials": "요가 매트",
  "creatorId": "testuser"
}
```

---

### 2. 모든 취미 조회
```http
GET /api/hobbies
```

**Response:**
```json
[
  {
    "id": 1,
    "hobbyName": "요가",
    "hobbyCategory": "운동/건강",
    "description": "요가 수업입니다.",
    "meetingType": "offline",
    "participationFee": 10000
  },
  {
    "id": 2,
    "hobbyName": "그림 그리기",
    "hobbyCategory": "예술/공예",
    "description": "미술 클래스",
    "meetingType": "online",
    "participationFee": 15000
  }
]
```

---

### 3. 카테고리별 취미 조회
```http
GET /api/hobbies/category/{category}
```

**Example:** `GET /api/hobbies/category/운동`

---

### 4. 취미 상세 조회 (ID)
```http
GET /api/hobbies/{id}
```

---

### 5. 취미 상세 조회 (이름)
```http
GET /api/hobbies/name?hobbyName={hobbyName}
```

**Example:** `GET /api/hobbies/name?hobbyName=요가`

---

### 6. 취미 참여
```http
POST /api/hobbies/{hobbyId}/participate?userId={userId}
```

---

### 7. 사용자가 참여한 취미 목록
```http
GET /api/hobbies/user/{userId}/participated
```

---

### 8. 사용자가 개설한 취미 목록
```http
GET /api/hobbies/user/{userId}/created
```

---

## 👥 Hobby Group API (`/api/hobby-groups`)

### 1. 모임 개설
```http
POST /api/hobby-groups
Content-Type: application/json
```

**Request Body:**
```json
{
  "groupName": "주말 요가 모임",
  "groupDescription": "매주 토요일 오전에 함께 요가해요",
  "meetingType": "offline",
  "locationLink": "서울시 강남구 요가센터",
  "participationFee": 5000,
  "materials": "요가 매트 (개인 지참)",
  "category": "운동/건강",
  "meetingDate": "매주 토요일 10:00",
  "creatorId": "testuser",
  "hobbyName": "요가",
  "groupImage": "base64_encoded_image"
}
```

---

### 2. 모든 모임 조회
```http
GET /api/hobby-groups
```

---

### 3. 모임 상세 조회
```http
GET /api/hobby-groups/{id}
```

---

### 4. 모임 수정
```http
PUT /api/hobby-groups/{id}
Content-Type: application/json
```

**Request Body:** (생성과 동일)

---

### 5. 모임 삭제
```http
DELETE /api/hobby-groups/{id}
```

---

### 6. 모임 참여
```http
POST /api/hobby-groups/{groupId}/participate?userId={userId}
```

---

### 7. 사용자가 참여한 모임 목록
```http
GET /api/hobby-groups/user/{userId}/participated
```

---

### 8. 사용자가 개설한 모임 목록
```http
GET /api/hobby-groups/user/{userId}/created
```

---

## 📋 Survey API (`/api/surveys`)

### 설문조사 제출
```http
POST /api/surveys/submit
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "testuser",
  "gender": "남성",
  "ageGroup": "20대",
  "preferredPlace": "실내에서 조용히 하는 걸 좋아해요",
  "propensity": "창의적이고 감성적인 편이에요",
  "budget": "5만원 이하",
  "currentHobbies": "독서, 음악 감상",
  "hobbyTime": "저녁",
  "timePerDay": "1시간 이하",
  "frequency": "주 3회 이하",
  "goal": "스트레스 해소 및 힐링",
  "sociality": "혼자 하는 걸 선호해요"
}
```

**Response:**
```json
{
  "userId": "testuser",
  "message": "설문이 성공적으로 저장되었습니다."
}
```

---

## 🤖 Recommendation API (`/api/recommend`)

### AI 취미 추천 요청
```http
POST /api/recommend
Content-Type: application/json
```

**Request Body:**
```json
{
  "gender": "남성",
  "age_group": "20대",
  "preferred_place": "실내에서 조용히 하는 걸 좋아해요",
  "propensity": "창의적이고 감성적인 편이에요",
  "budget": "5만원 이하",
  "hobby_time": "저녁",
  "time_per_day": "1시간 이하",
  "frequency": "주 3회 이하",
  "goal": "스트레스 해소 및 힐링",
  "sociality": "혼자 하는 걸 선호해요"
}
```

**Response:**
```json
{
  "recommended_hobbies": [
    "그림 그리기",
    "독서",
    "요가",
    "음악 감상",
    "퍼즐 맞추기"
  ],
  "recommended_ids": [1, 20, 6, 28, 24]
}
```

---

## 🐍 Flask AI Server API (Render)

### Health Check
```http
GET https://customhobby.onrender.com/
```

**Response:**
```json
{
  "status": "active",
  "model": "Improved Deep Autoencoder (Threshold-based)",
  "threshold": 0.5,
  "hobbies_count": 43
}
```

---

### AI 추천 (Direct)
```http
POST https://customhobby.onrender.com/recommend
Content-Type: application/json
```

**Request/Response:** (위 `/api/recommend`와 동일)

---

## 🔗 에러 응답 형식

### 400 Bad Request
```json
{
  "error": "잘못된 요청입니다.",
  "details": "필수 필드가 누락되었습니다."
}
```

### 404 Not Found
```json
{
  "message": "해당 리소스를 찾을 수 없습니다.",
  "requestedId": 999
}
```

### 500 Internal Server Error
```json
{
  "error": "서버 내부 오류가 발생했습니다.",
  "details": "상세 에러 메시지"
}
```

---

## 📊 설문 항목 값 목록

### gender (성별)
- `남성`
- `여성`

### age_group (연령대)
- `10대`
- `20대`
- `30대`
- `40대 이상`

### preferred_place (선호 장소)
- `실내에서 조용히 하는 걸 좋아해요`
- `밖에서 하는 걸 좋아해요`
- `장소에 크게 구애받지 않아요`

### propensity (성향)
- `창의적이고 감성적인 편이에요`
- `활동적인 편이에요`
- `조용하고 차분한 편이에요`
- `상황에 따라 달라요`

### budget (예산)
- `5만원 이하`
- `5만원 ~ 10만원`
- `10만원 이상`

### hobby_time (활동 시간대)
- `오전`
- `오후`
- `저녁`
- `주말 중심`

### time_per_day (하루 투자 시간)
- `30분 이하`
- `1시간 이하`
- `1~2시간`
- `2시간 이상`

### frequency (활동 빈도)
- `매일`
- `주 3회 이하`
- `불규칙하게 하고 싶어요`

### goal (목표)
- `스트레스 해소 및 힐링`
- `자기계발`
- `사람들과의 교류`
- `성취감과 만족감`

### sociality (사회성)
- `혼자 하는 걸 선호해요`
- `함께 하는 걸 선호해요`
- `상황에 따라 달라요`

---

## 📝 지원하는 취미 목록 (43종)

| ID | 취미명 | ID | 취미명 |
|----|--------|----|----|
| 1 | 그림 그리기 | 23 | 보석십자수 |
| 2 | 캘리그래피 | 24 | 퍼즐 맞추기 |
| 3 | 사진 촬영 | 25 | 게임 |
| 4 | 기타 연주 | 26 | OTT 감상 |
| 5 | 피아노 연주 | 27 | 영화 보기 |
| 6 | 요가 | 28 | 음악 감상 |
| 7 | 필라테스 | 29 | 연극 관람 |
| 8 | 헬스 | 30 | 콘서트 관람 |
| 9 | 러닝 | 31 | 야구 관람 |
| 10 | 수영 | 32 | 축구 관람 |
| 12 | 자전거 타기 | 33 | 풋살 |
| 13 | 차박 | 34 | 배드민턴 |
| 14 | 여행 | 35 | 클라이밍 |
| 15 | 골프 | 36 | 요리 클래스 |
| 16 | 복싱 | 37 | 디자인 |
| 17 | 요리 | 38 | 악기 연주 |
| 18 | 베이킹 | 39 | 캠핑 |
| 19 | 커피 브루잉 | 40 | 등산 |
| 20 | 독서 | 41 | 홈트레이닝 |
| 21 | 언어 공부 | 42 | 자기계발 |
| 22 | 뜨개질 | 43 | 드로잉 |
|    |        | 45 | 연주회 감상 |


