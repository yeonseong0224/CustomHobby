# CustomHobby API 문서

## 📚 개요
CustomHobby 백엔드 API 문서입니다. Supabase PostgreSQL 데이터베이스와 연결되어 있습니다.

---

## 🔗 베이스 URL
```
http://localhost:8080/api
```

---

## 👤 사용자 API (`/api/users`)

### 1. 회원가입
```http
POST /api/users/register
```

**Request Body:**
```json
{
  "userId": "testuser",
  "password": "password123",
  "email": "test@example.com",
  "nickname": "테스트유저",
  "age": 25,
  "region": "서울"
}
```

### 2. 로그인
```http
POST /api/users/login
```

**Request Body:**
```json
{
  "userId": "testuser",
  "password": "password123"
}
```

### 3. 사용자 정보 조회
```http
GET /api/users/{userId}
```

---

## 📝 설문조사 API (`/api/surveys`)

### 1. 설문조사 제출
```http
POST /api/surveys/submit
```

**Request Body:**
```json
{
  "userId": 1,
  "surveyId": 1,
  "answers": {
    "1": "남성",
    "2": "20대 초·중반",
    "3": "실내",
    "4": "창의적",
    "5": "1시간",
    "6": "주 2~3회",
    "7": "저녁",
    "8": "중간",
    "9": "스트레스 해소",
    "10": "함께"
  }
}
```

### 2. 사용자 설문 응답 조회
```http
GET /api/surveys/user/{userId}
```

### 3. 특정 설문 응답 조회
```http
GET /api/surveys/user/{userId}/survey/{surveyId}
```

---

## 🎨 취미 API (`/api/hobbies`)

### 1. 취미 생성
```http
POST /api/hobbies
```

**Request Body:**
```json
{
  "hobbyName": "수채화 그리기",
  "hobbyCategory": "예술/공예",
  "description": "수채화를 함께 그리는 모임입니다.",
  "oneLineDescription": "물감과 붓으로 표현하는 예술",
  "meetingType": "offline",
  "locationLink": "서울시 강남구 아트센터",
  "meetingDate": "2025-11-01",
  "participationFee": 10000,
  "materials": "수채화 물감, 붓, 스케치북",
  "haveMaterial": "물감 세트",
  "creatorId": 1
}
```

### 2. 모든 취미 조회
```http
GET /api/hobbies
```

### 3. 카테고리별 취미 조회
```http
GET /api/hobbies/category/{category}
```

**카테고리 종류:**
- `예술/공예`
- `야외활동`
- `음악/공연`
- `요리/음식`

### 4. 취미 상세 조회
```http
GET /api/hobbies/{id}
```

### 5. 취미 참여
```http
POST /api/hobbies/{hobbyId}/participate?userId={userId}
```

### 6. 사용자가 참여한 취미 목록
```http
GET /api/hobbies/user/{userId}/participated
```

### 7. 사용자가 개설한 취미 목록
```http
GET /api/hobbies/user/{userId}/created
```

---

## 👥 모임 API (`/api/hobby-groups`)

### 1. 모임 개설
```http
POST /api/hobby-groups
```

**Request Body:**
```json
{
  "groupName": "주말 등산 모임",
  "groupDescription": "매주 토요일 아침에 산을 오르는 모임입니다.",
  "meetingType": "offline",
  "locationLink": "서울 북한산",
  "participationFee": 0,
  "materials": "등산화, 물, 간식",
  "creatorId": 1
}
```

### 2. 모든 모임 조회
```http
GET /api/hobby-groups
```

### 3. 모임 상세 조회
```http
GET /api/hobby-groups/{id}
```

### 4. 모임 참여
```http
POST /api/hobby-groups/{groupId}/participate?userId={userId}
```

### 5. 사용자가 참여한 모임 목록
```http
GET /api/hobby-groups/user/{userId}/participated
```

### 6. 사용자가 개설한 모임 목록
```http
GET /api/hobby-groups/user/{userId}/created
```

---

## 📊 데이터베이스 구조

### 주요 테이블

1. **users** - 사용자 정보
2. **hobbies** - 취미 정보
3. **hobby_groups** - 모임 정보
4. **surveys** - 설문조사 템플릿
5. **questions** - 설문 질문
6. **user_survey_responses** - 사용자 설문 응답
7. **survey_answers** - 설문 답변
8. **user_participated_hobbies** - 사용자-취미 참여 관계
9. **user_participated_groups** - 사용자-모임 참여 관계

---

## 🚀 시작하기

### 1. 백엔드 실행
```bash
cd backend/devhobby
./gradlew bootRun
```

### 2. 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

### 3. 데이터베이스 설정
- Supabase 무료 플랜 사용
- `application.yml`에서 데이터베이스 연결 정보 확인

---

## ⚠️ 주의사항

1. **userId 관리**: 로그인 후 localStorage에 userId를 저장하여 사용
2. **설문조사 ID**: 첫 번째 설문조사의 ID는 1입니다
3. **이미지**: 현재 DB에는 bytea 타입으로 저장되지만, 프론트엔드에서는 로컬 이미지 사용
4. **참가비**: Integer 타입으로 저장 (원 단위)

---

## 📝 설문조사 질문 ID 매핑

프론트엔드 SurveyPage에서 사용하는 질문 ID:

1. 성별
2. 연령대
3. 취미 장소
4. 활동 성향
5. 투자 시간
6. 주기
7. 시간대
8. 예산
9. 목적
10. 혼자/함께

---

## 🔄 업데이트 로그

- 2025-10-29: 초기 API 구현 완료
  - User, Survey, Hobby, HobbyGroup 모듈 완성
  - Supabase 연동 완료
  - 프론트엔드 API 연결 완료














