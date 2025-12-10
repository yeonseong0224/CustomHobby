# 🎯 CustomHobby - AI 기반 취미 추천 플랫폼

> 사용자 설문조사를 기반으로 AI가 맞춤형 취미를 추천해주고, 취미 모임을 개설/참여할 수 있는 풀스택 웹 서비스

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F)
![AI](https://img.shields.io/badge/AI-TensorFlow-FF6F00)

---

## 📌 프로젝트 개요

**CustomHobby**는 사용자의 성향, 라이프스타일, 예산 등을 분석하여 개인에게 최적화된 취미를 AI로 추천해주는 서비스입니다.

### 주요 기능
- 🔐 **회원 가입/로그인** - 사용자 인증 시스템
- 📋 **설문조사** - 10가지 항목 기반 사용자 성향 분석
- 🤖 **AI 취미 추천** - Deep Autoencoder 기반 맞춤 추천
- 🏠 **취미 모임 개설/참여** - 관심 있는 취미 그룹 활동
- 👤 **마이페이지** - 프로필 관리 및 활동 내역

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | React 18, React Router, Axios, TailwindCSS |
| **Backend** | Spring Boot 3, JPA/Hibernate, Gradle |
| **AI Server** | Flask, TensorFlow/Keras, Pandas, NumPy |
| **Database** | PostgreSQL (Fly.io) |
| **Deployment** | Vercel (Frontend), Fly.io (Backend), Render (AI) |

---

## 🚀 배포 URL

| 서비스 | 플랫폼 | URL |
|--------|--------|-----|
| Frontend | Vercel | `https://your-frontend.vercel.app` |
| Backend | Fly.io | `https://your-backend.fly.dev` |
| AI Server | Render | `https://customhobby.onrender.com` |

---

## 📁 프로젝트 구조

```
CustomHobby/
├── frontend/                    # React 프론트엔드
│   ├── src/
│   │   ├── api/                 # API 통신 모듈
│   │   ├── components/          # 재사용 컴포넌트
│   │   ├── context/             # React Context (인증)
│   │   ├── pages/               # 페이지 컴포넌트
│   │   └── styles/              # CSS 스타일
│   └── public/                  # 정적 파일, 이미지
│
├── backend/devhobby/            # Spring Boot 백엔드
│   └── src/main/java/com/customhobby/backend/
│       ├── config/              # 설정 (CORS, Security)
│       ├── controller/          # REST API 컨트롤러
│       ├── dto/                 # 데이터 전송 객체
│       ├── entity/              # JPA 엔티티
│       ├── repository/          # 데이터 접근 계층
│       ├── service/             # 비즈니스 로직
│       └── exception/           # 예외 처리
│
└── ai-server/                   # Flask AI 서버
    ├── recommend_app.py         # 추천 API 서버
    ├── hobby_autoencoder.keras  # 학습된 모델
    ├── model_assets.pkl         # 전처리 도구
    └── requirements.txt         # Python 의존성
```

---

## ⚙️ 로컬 개발 환경 설정

### 1. Frontend 실행
```bash
cd frontend
npm install
npm start
# http://localhost:3000 에서 실행
```

### 2. Backend 실행
```bash
cd backend/devhobby
./gradlew bootRun
# http://localhost:8080 에서 실행
```

### 3. AI Server 실행
```bash
cd ai-server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python recommend_app.py
# http://localhost:5000 에서 실행
```

---

## 🔑 환경 변수

### Frontend (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/customhobby
    username: your_username
    password: your_password
```

---

## 👥 팀 구성

| 역할 | 담당 |
|------|------|
| Frontend | React UI/UX 개발 |
| Backend | Spring Boot API 개발 |
| AI/ML | 추천 알고리즘 개발 |
| DevOps | 배포 및 인프라 관리 |

---

## 📄 라이선스

이 프로젝트는 학습 및 포트폴리오 목적으로 제작되었습니다.

---

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.


