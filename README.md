# 🎯 CustomHobby - 개인 맞춤 취미 추천 플랫폼

사용자의 성향을 분석하여 맞춤 취미를 추천하고, 취미 모임을 개설하거나 참여할 수 있는 웹 플랫폼입니다.

---

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [API 문서](#api-문서)
- [데이터베이스](#데이터베이스)

---

## 🎯 프로젝트 개요

CustomHobby는 사용자의 취미 성향을 파악하여 개인화된 취미를 추천하고, 같은 취미를 가진 사람들과 모임을 만들 수 있는 플랫폼입니다.

### 핵심 가치
- 📊 **개인화 추천**: 10개 질문 설문조사를 통한 맞춤 취미 추천
- 👥 **커뮤니티**: 취미 모임 개설 및 참여
- 🎨 **다양한 카테고리**: 예술/공예, 야외활동, 음악/공연, 요리/음식 등

---

## ✨ 주요 기능

### 1️⃣ 설문조사 기반 취미 추천
- 10개 질문으로 구성된 성향 분석 설문
- 성별, 연령대, 선호 장소, 활동 성향 등 파악
- 설문 결과를 AI 학습에 활용하여 개인화 추천

### 2️⃣ 취미 탐색
- 카테고리별 취미 목록 조회
- 취미 상세 정보 (설명, 참가비, 준비물 등)
- 취미 참여 기능

### 3️⃣ 모임 관리
- 취미 모임 개설
- 모임 참여
- 내가 참여한/개설한 모임 관리

### 4️⃣ 마이페이지
- 참여한 취미 목록
- 개설한 모임 목록
- 자기소개 작성
- 설문조사 재작성

---

## 🛠 기술 스택

### Frontend
- **React** 18.x
- **React Router** 6.x
- **Axios** - API 통신
- **CSS3** - 스타일링

### Backend
- **Spring Boot** 3.x
- **Spring Data JPA** - ORM
- **PostgreSQL** - 데이터베이스 (Supabase)
- **Lombok** - 코드 간소화
- **Gradle** - 빌드 도구

### Database
- **Supabase PostgreSQL** (무료 플랜)

---

## 📂 프로젝트 구조

```
CustomHobby/
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── api/            # API 호출 함수
│   │   │   ├── userApi.js
│   │   │   ├── surveyApi.js
│   │   │   ├── hobbyApi.js
│   │   │   └── hobbyGroupApi.js
│   │   ├── components/     # 재사용 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   └── styles/         # CSS 스타일
│   └── public/
│       └── images/         # 이미지 리소스
│
├── backend/devhobby/       # Spring Boot 백엔드
│   └── src/main/java/com/customhobby/backend/
│       ├── config/         # 설정 (Security, CORS)
│       ├── controller/     # REST API 컨트롤러
│       │   ├── UserController.java
│       │   ├── SurveyController.java
│       │   ├── HobbyController.java
│       │   └── HobbyGroupController.java
│       ├── domain/         # 엔티티 모델
│       │   ├── User.java
│       │   ├── Hobby.java
│       │   ├── HobbyGroup.java
│       │   ├── Survey.java
│       │   └── ...
│       ├── dto/            # 데이터 전송 객체
│       ├── repository/     # JPA Repository
│       ├── service/        # 비즈니스 로직
│       └── exception/      # 예외 처리
│
└── API_DOCUMENTATION.md    # API 상세 문서
```

---

## 🚀 설치 및 실행

### 사전 요구사항
- **Node.js** 16.x 이상
- **Java** 17 이상
- **Gradle** 7.x 이상

### 1. 프론트엔드 실행

```bash
cd frontend
npm install
npm start
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 2. 백엔드 실행

```bash
cd backend/devhobby
./gradlew clean build
./gradlew bootRun
```

백엔드는 `http://localhost:8080`에서 실행됩니다.

### 3. 데이터베이스 설정

`backend/devhobby/src/main/resources/application.yml` 파일에서 데이터베이스 연결 정보를 확인하세요.

```yaml
spring:
  datasource:
    url: jdbc:postgresql://aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require
    username: postgres.oelmefqcgjtjcimlwyay
    password: 1234
```

---

## 📖 API 문서

상세한 API 문서는 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)를 참고하세요.

### 주요 엔드포인트

| 기능 | Method | URL |
|------|--------|-----|
| 회원가입 | POST | `/api/users/register` |
| 로그인 | POST | `/api/users/login` |
| 설문조사 제출 | POST | `/api/surveys/submit` |
| 모든 취미 조회 | GET | `/api/hobbies` |
| 카테고리별 취미 조회 | GET | `/api/hobbies/category/{category}` |
| 취미 참여 | POST | `/api/hobbies/{hobbyId}/participate` |
| 모임 개설 | POST | `/api/hobby-groups` |
| 모임 참여 | POST | `/api/hobby-groups/{groupId}/participate` |

---

## 🗄 데이터베이스

### ERD 주요 테이블

1. **users** - 사용자 정보
2. **hobbies** - 취미 정보
3. **hobby_groups** - 모임 정보
4. **surveys** - 설문조사 템플릿
5. **questions** - 설문 질문
6. **user_survey_responses** - 사용자 설문 응답
7. **survey_answers** - 설문 답변 (텍스트 저장)
8. **user_participated_hobbies** - 사용자-취미 참여 관계
9. **user_participated_groups** - 사용자-모임 참여 관계

---

## 🎨 주요 페이지

### 1. 시작 페이지 (`/`)
- 로그인/회원가입 버튼

### 2. 회원가입 페이지 (`/register`)
- 설문조사 페이지로 이동

### 3. 설문조사 페이지 (`/survey`)
- 10개 질문 응답
- 완료 후 메인 페이지로 이동

### 4. 메인 페이지 (`/main`)
- 개인 맞춤 취미 추천
- 새로운 취미 소개

### 5. 카테고리 페이지 (`/category`)
- 4가지 카테고리 선택

### 6. 취미 정보 페이지 (`/hobby-info/:id`)
- 카테고리별 취미 목록

### 7. 취미 상세 페이지 (`/hobby-detail/:id`)
- 취미 상세 정보
- 참여하기 버튼

### 8. 모임 개설 페이지 (`/create-group`)
- 모임 정보 입력

### 9. 마이 페이지 (`/my-page`)
- 참여한 취미
- 개설한 모임
- 자기소개

---

## 🔧 주요 구현 사항

### 백엔드
✅ Spring Boot REST API 완성
✅ Supabase PostgreSQL 연동
✅ JPA Entity 및 Repository 구현
✅ 설문조사 저장 및 조회
✅ 취미 CRUD 및 참여 기능
✅ 모임 CRUD 및 참여 기능
✅ CORS 설정 (프론트엔드 연동)

### 프론트엔드
✅ React 페이지 구현
✅ API 연동 (axios)
✅ 설문조사 제출 기능
✅ 취미 조회 및 참여
✅ 모임 개설 및 참여
✅ 마이페이지 데이터 연동

---

## 📝 TODO (향후 개선 사항)

- [ ] JWT 인증 구현
- [ ] 이미지 업로드 기능
- [ ] AI 기반 취미 추천 알고리즘
- [ ] 모임 캘린더 기능
- [ ] 게시판 기능
- [ ] 알림 기능
- [ ] 검색 기능

---

## 👨‍💻 개발자

- **프로젝트 기간**: 2025년 10월
- **개발 환경**: Windows 10, Java 17, Node.js 18

---

## 📄 라이선스

This project is private.

---

## 🙏 감사합니다!

CustomHobby를 사용해주셔서 감사합니다. 
문의사항이 있으시면 이슈를 등록해주세요.










