import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 반드시 추가
import "../styles/SurveyPage.css";

export default function SurveyPage() {
  const navigate = useNavigate(); // ✅ 여기서 navigate 선언
  const [answers, setAnswers] = useState({});

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🧠 설문 결과:", answers);

    alert("설문이 제출되었습니다! 로그인 페이지로 이동합니다.");

    // ✅ navigate가 정의된 상태에서 실행
    setTimeout(() => {
      navigate("/"); // App.jsx 기준 '/' = StartPage
    }, 300);
  };

  return (
    <div className="survey-container">
      <h1>🎯 취미 성향 설문조사</h1>

      <form onSubmit={handleSubmit}>
        {/* 1️⃣ 성별 */}
        <div className="question">
          <h3>1. 성별을 선택해주세요</h3>
          <label><input type="radio" name="gender" value="남성" onChange={(e)=>handleChange("gender", e.target.value)} /> 남성</label>
          <label><input type="radio" name="gender" value="여성" onChange={(e)=>handleChange("gender", e.target.value)} /> 여성</label>
        </div>

        {/* 2️⃣ 연령대 */}
        <div className="question">
          <h3>2. 연령대를 선택해주세요</h3>
          <label><input type="radio" name="ageGroup" value="10대" onChange={(e)=>handleChange("ageGroup", e.target.value)} /> 10대</label>
          <label><input type="radio" name="ageGroup" value="20대 초·중반" onChange={(e)=>handleChange("ageGroup", e.target.value)} /> 20대 초·중반</label>
          <label><input type="radio" name="ageGroup" value="20대 후반" onChange={(e)=>handleChange("ageGroup", e.target.value)} /> 20대 후반</label>
          <label><input type="radio" name="ageGroup" value="30대" onChange={(e)=>handleChange("ageGroup", e.target.value)} /> 30대</label>
          <label><input type="radio" name="ageGroup" value="40·50대 이상" onChange={(e)=>handleChange("ageGroup", e.target.value)} /> 40·50대 이상</label>
        </div>

        {/* 3️⃣ 취미 장소 */}
        <div className="question">
          <h3>3. 취미 활동을 선호하는 장소는 어디인가요?</h3>
          <label><input type="radio" name="place" value="실내" onChange={(e)=>handleChange("place", e.target.value)} /> 실내</label>
          <label><input type="radio" name="place" value="실외" onChange={(e)=>handleChange("place", e.target.value)} /> 실외</label>
          <label><input type="radio" name="place" value="상관없음" onChange={(e)=>handleChange("place", e.target.value)} /> 상관없음</label>
        </div>

        {/* 4️⃣ 활동 성향 */}
        <div className="question">
          <h3>4. 취미 활동 성향은 어떤 편인가요?</h3>
          <label><input type="radio" name="activityType" value="창의적" onChange={(e)=>handleChange("activityType", e.target.value)} /> 창의적</label>
          <label><input type="radio" name="activityType" value="활동적" onChange={(e)=>handleChange("activityType", e.target.value)} /> 활동적</label>
          <label><input type="radio" name="activityType" value="정적인" onChange={(e)=>handleChange("activityType", e.target.value)} /> 정적인</label>
          <label><input type="radio" name="activityType" value="사교적인" onChange={(e)=>handleChange("activityType", e.target.value)} /> 사교적인</label>
        </div>

        {/* 5️⃣ 투자 시간 */}
        <div className="question">
          <h3>5. 하루에 취미 활동에 투자할 수 있는 시간은 얼마나 되나요?</h3>
          <label><input type="radio" name="timePerDay" value="30분" onChange={(e)=>handleChange("timePerDay", e.target.value)} /> 30분</label>
          <label><input type="radio" name="timePerDay" value="1시간" onChange={(e)=>handleChange("timePerDay", e.target.value)} /> 1시간</label>
          <label><input type="radio" name="timePerDay" value="2시간" onChange={(e)=>handleChange("timePerDay", e.target.value)} /> 2시간</label>
          <label><input type="radio" name="timePerDay" value="3시간" onChange={(e)=>handleChange("timePerDay", e.target.value)} /> 3시간</label>
          <label><input type="radio" name="timePerDay" value="상관없음" onChange={(e)=>handleChange("timePerDay", e.target.value)} /> 상관없음</label>
        </div>

        {/* 6️⃣ 주기 */}
        <div className="question">
          <h3>6. 취미 활동 주기는 어느 정도로 하고 싶나요?</h3>
          <label><input type="radio" name="frequency" value="일 1회" onChange={(e)=>handleChange("frequency", e.target.value)} /> 일 1회</label>
          <label><input type="radio" name="frequency" value="주 2~3회" onChange={(e)=>handleChange("frequency", e.target.value)} /> 주 2~3회</label>
          <label><input type="radio" name="frequency" value="주 1회" onChange={(e)=>handleChange("frequency", e.target.value)} /> 주 1회</label>
          <label><input type="radio" name="frequency" value="월 2~3회" onChange={(e)=>handleChange("frequency", e.target.value)} /> 월 2~3회</label>
          <label><input type="radio" name="frequency" value="여행형" onChange={(e)=>handleChange("frequency", e.target.value)} /> 여행형</label>
        </div>

        {/* 7️⃣ 시간대 */}
        <div className="question">
          <h3>7. 취미를 즐기고 싶은 시간대는 언제인가요?</h3>
          <label><input type="radio" name="time" value="새벽" onChange={(e)=>handleChange("time", e.target.value)} /> 새벽</label>
          <label><input type="radio" name="time" value="오전" onChange={(e)=>handleChange("time", e.target.value)} /> 오전</label>
          <label><input type="radio" name="time" value="오후" onChange={(e)=>handleChange("time", e.target.value)} /> 오후</label>
          <label><input type="radio" name="time" value="저녁" onChange={(e)=>handleChange("time", e.target.value)} /> 저녁</label>
        </div>

        {/* 8️⃣ 예산 */}
        <div className="question">
          <h3>8. 취미 활동에 사용할 수 있는 예산은 어느 정도인가요?</h3>
          <label><input type="radio" name="budget" value="무예산" onChange={(e)=>handleChange("budget", e.target.value)} /> 무예산</label>
          <label><input type="radio" name="budget" value="저예산" onChange={(e)=>handleChange("budget", e.target.value)} /> 저예산</label>
          <label><input type="radio" name="budget" value="중간" onChange={(e)=>handleChange("budget", e.target.value)} /> 중간</label>
          <label><input type="radio" name="budget" value="고예산" onChange={(e)=>handleChange("budget", e.target.value)} /> 고예산</label>
          <label><input type="radio" name="budget" value="상관없음" onChange={(e)=>handleChange("budget", e.target.value)} /> 상관없음</label>
        </div>

        {/* 9️⃣ 목적 */}
        <div className="question">
          <h3>9. 취미 활동을 통해 얻고 싶은 것은 무엇인가요?</h3>
          <label><input type="radio" name="purpose" value="스트레스 해소" onChange={(e)=>handleChange("purpose", e.target.value)} /> 스트레스 해소</label>
          <label><input type="radio" name="purpose" value="자기계발" onChange={(e)=>handleChange("purpose", e.target.value)} /> 자기계발</label>
          <label><input type="radio" name="purpose" value="사회적 교류" onChange={(e)=>handleChange("purpose", e.target.value)} /> 사회적 교류</label>
          <label><input type="radio" name="purpose" value="건강관리" onChange={(e)=>handleChange("purpose", e.target.value)} /> 건강관리</label>
        </div>

        {/* 🔟 혼자/함께 */}
        <div className="question">
          <h3>10. 혼자 하는 취미 활동을 선호하시나요, 함께 하는 취미 활동을 선호하시나요?</h3>
          <label><input type="radio" name="alone" value="혼자" onChange={(e)=>handleChange("alone", e.target.value)} /> 혼자</label>
          <label><input type="radio" name="alone" value="함께" onChange={(e)=>handleChange("alone", e.target.value)} /> 함께</label>
          <label><input type="radio" name="alone" value="상관없음" onChange={(e)=>handleChange("alone", e.target.value)} /> 상관없음</label>
        </div>

        <button type="submit">제출하기</button>
      </form>
    </div>
  );
}
