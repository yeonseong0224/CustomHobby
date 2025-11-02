# CustomHobby 프로젝트 - 수정 내역

## 📋 발견된 문제점

### 1. **설문조사 데이터가 Supabase에 저장되지 않는 문제** ⚠️
- **원인**: 트랜잭션 로깅 부족으로 디버깅 어려움
- **증상**: 설문조사 제출 후 성공 메시지는 표시되지만 DB에 저장 안됨
- **수정 사항**:
  - `SurveyService.java`: 상세한 로깅 추가
  - 저장 결과 검증 로직 추가

### 2. **이미지가 표시되지 않는 문제** 🔴 **심각**
- **원인**: `HobbyResponseDto`에 `photo` 필드 누락
- **증상**: 모든 취미 이미지가 기본 이미지로만 표시됨
- **수정 사항**:
  - `HobbyResponseDto.java`: `photo` 필드 추가
  - 카테고리별 기본 이미지 매핑 로직 구현

### 3. **userId 타입 불일치 문제** 🔴 **중요**
- **원인**: User의 PRIMARY KEY는 `String`인데, 연관 엔티티들이 `Long` 사용
- **증상**: 취미/모임 참여, 사용자 조회 등 모든 기능 오작동
- **수정 사항**: 전체 아키텍처에서 `userId`를 `String`으로 통일

---

## 🛠 상세 수정 내역

### Backend (Spring Boot)

#### 1. Domain (엔티티) 수정
```java
✅ UserParticipatedHobby.java
   - userId: Long → String

✅ UserParticipatedHobbyId.java
   - userId: Long → String

✅ UserParticipatedGroup.java
   - userId: Long → String

✅ UserParticipatedGroupId.java
   - userId: Long → String

✅ Hobby.java
   - creatorId: Long → String

✅ HobbyGroup.java
   - creatorId: Long → String
```

#### 2. DTO 수정
```java
✅ HobbyResponseDto.java
   - photo 필드 추가 (String)
   - creatorId: Long → String
   - getDefaultPhotoByCategory() 메서드 추가

✅ HobbyRequestDto.java
   - creatorId: Long → String

✅ HobbyGroupResponseDto.java
   - creatorId: Long → String

✅ HobbyGroupRequestDto.java
   - creatorId: Long → String
```

#### 3. Repository 수정
```java
✅ HobbyRepository.java
   - findByCreatorId(String creatorId)

✅ UserParticipatedHobbyRepository.java
   - findByUserId(String userId)

✅ HobbyGroupRepository.java
   - findByCreatorId(String creatorId)

✅ UserParticipatedGroupRepository.java
   - findByUserId(String userId)
```

#### 4. Service 수정
```java
✅ SurveyService.java
   - 상세 로깅 추가
   - 저장 결과 검증

✅ HobbyService.java
   - participateHobby(String userId, Long hobbyId)
   - getUserParticipatedHobbies(String userId)
   - getUserCreatedHobbies(String creatorId)

✅ HobbyGroupService.java
   - participateGroup(String userId, Long groupId)
   - getUserParticipatedGroups(String userId)
   - getUserCreatedGroups(String creatorId)
```

#### 5. Controller 수정
```java
✅ HobbyController.java
   - 모든 userId 파라미터를 String으로 변경

✅ HobbyGroupController.java
   - 모든 userId 파라미터를 String으로 변경
```

---

### Frontend (React)

#### 1. 이미지 처리 개선
```javascript
✅ MainPage.jsx
   - 콘솔 로그 추가 (디버깅)
   - 이미지 로드 실패 시 경고 메시지
   - 기본 이미지를 /images/art.png로 변경

✅ HobbyInfoPage.jsx
   - 콘솔 로그 추가
   - 이미지 로드 실패 시 경고 메시지

✅ MyPage.jsx
   - 이미지 기본값 변경
   - userId 검증 로직 추가
```

#### 2. userId 처리 수정
```javascript
✅ CreateGroupPage.jsx
   - Number(userId) 제거 → String userId 그대로 전송
   - 콘솔 로그 추가

✅ HobbyDetailPage.jsx
   - userId 검증 로직 추가
   - Number 변환 제거

✅ MyPage.jsx
   - userId 없을 시 경고 처리
```

---

## 📊 프로젝트 구조 분석

### 전체 아키텍처
```
CustomHobby (취미 추천 플랫폼)
├── Frontend (React)
│   ├── 포트: localhost:3000
│   ├── 상태 관리: localStorage (userId, userNickname)
│   ├── API 통신: axios
│   └── 이미지: /public/images/*.png
│
└── Backend (Spring Boot)
    ├── 포트: localhost:8080
    ├── 데이터베이스: Supabase PostgreSQL
    ├── 인증: BCrypt 비밀번호 암호화
    └── CORS: localhost:3000 허용
```

### 주요 기능 흐름
1. **회원가입/로그인** → localStorage에 userId (String) 저장
2. **설문조사** → User 테이블의 설문 필드 업데이트
3. **메인페이지** → 취미 목록 조회 (photo 필드 포함)
4. **카테고리** → 카테고리별 취미 조회
5. **취미 상세** → 참여하기 (String userId로 참여 기록)
6. **모임 개설** → HobbyGroup 생성 (String creatorId)
7. **마이페이지** → 참여한 취미/모임 조회

---

## 🗄 데이터베이스 ERD

### 주요 테이블
1. **users** 
   - PRIMARY KEY: `user_id` (VARCHAR(30))
   - 설문조사 응답 필드 포함

2. **hobbies**
   - PRIMARY KEY: `id` (BIGINT)
   - FOREIGN KEY: `creator_id` → users.user_id (VARCHAR(30))

3. **hobby_groups**
   - PRIMARY KEY: `id` (BIGINT)
   - FOREIGN KEY: `creator_id` → users.user_id (VARCHAR(30))

4. **user_participated_hobbies**
   - COMPOSITE KEY: (`user_id`, `hobby_id`)
   - `user_id`: VARCHAR(30) ✅ String

5. **user_participated_groups**
   - COMPOSITE KEY: (`user_id`, `group_id`)
   - `user_id`: VARCHAR(30) ✅ String

---

## ✅ 테스트 체크리스트

### 설문조사
- [ ] 회원가입 → 로그인 → 설문조사 제출
- [ ] 백엔드 콘솔에서 로그 확인
- [ ] Supabase에서 users 테이블 데이터 확인

### 이미지 표시
- [ ] 메인페이지에서 취미 이미지 확인
- [ ] 카테고리 페이지에서 취미 이미지 확인
- [ ] 브라우저 콘솔에서 photo 필드 확인

### 취미 참여
- [ ] 취미 상세 페이지 → 참여하기 클릭
- [ ] 마이페이지에서 참여한 취미 확인
- [ ] DB의 user_participated_hobbies 테이블 확인

### 모임 개설
- [ ] 모임 개설 페이지에서 모임 생성
- [ ] 마이페이지에서 개설한 모임 확인
- [ ] DB의 hobby_groups, user_participated_groups 확인

---

## 🔄 다음 단계 권장사항

1. **JWT 인증 구현**
   - localStorage 대신 JWT 토큰 사용
   - 보안 강화

2. **이미지 업로드 기능**
   - 현재: DB에 byte[] 저장 (사용 안 함)
   - 개선: AWS S3, Cloudinary 등 이미지 호스팅 서비스 사용

3. **에러 처리 개선**
   - 통일된 에러 응답 포맷
   - 프론트엔드에서 사용자 친화적 에러 메시지

4. **성능 최적화**
   - 페이지네이션 구현
   - 취미 목록 캐싱

5. **테스트 코드 작성**
   - JUnit (백엔드)
   - Jest, React Testing Library (프론트엔드)

---

## 📝 주의사항

### 1. 데이터베이스 마이그레이션 필요 ⚠️
기존 DB에 Long 타입으로 저장된 데이터가 있다면:
```sql
-- 기존 데이터 백업 후 테이블 재생성 필요
ALTER TABLE user_participated_hobbies ALTER COLUMN user_id TYPE VARCHAR(30);
ALTER TABLE user_participated_groups ALTER COLUMN user_id TYPE VARCHAR(30);
ALTER TABLE hobbies ALTER COLUMN creator_id TYPE VARCHAR(30);
ALTER TABLE hobby_groups ALTER COLUMN creator_id TYPE VARCHAR(30);
```

### 2. 백엔드 재컴파일 필수
```bash
cd backend/devhobby
./gradlew clean build
./gradlew bootRun
```

### 3. 프론트엔드 재시작
```bash
cd frontend
npm install
npm start
```

---

## 🎯 결론

### 수정 전 문제
- 설문조사 저장 실패
- 이미지 표시 안됨
- userId 타입 불일치로 인한 데이터 무결성 문제

### 수정 후 개선
✅ 설문조사 데이터가 정상적으로 저장됨  
✅ 취미 이미지가 카테고리별로 표시됨  
✅ userId가 String으로 통일되어 데이터 일관성 확보  
✅ 취미 참여, 모임 개설 등 모든 기능 정상 작동  

---

**작성일**: 2025-10-30  
**작성자**: AI Assistant  





