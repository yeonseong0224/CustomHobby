import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SurveyForm() {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setAnswers((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 설문 응답 출력 (테스트용)
    console.log("Survey Answers:", answers);

    // 알림창 띄우기
    alert("설문이 완료되었습니다! 로그인 페이지로 이동합니다.");

    // 로그인(시작) 페이지로 이동
    navigate("/");
  };

  return (
    <form className="survey-form" onSubmit={handleSubmit}>
      <h3>취미 설문</h3>

      <label>
        활동 성향:
        <select onChange={(e) => handleChange("style", e.target.value)}>
          <option value="">선택</option>
          <option value="active">활동적</option>
          <option value="calm">조용한</option>
        </select>
      </label>

      <label>
        실내/실외:
        <select onChange={(e) => handleChange("place", e.target.value)}>
          <option value="">선택</option>
          <option value="indoor">실내</option>
          <option value="outdoor">실외</option>
        </select>
      </label>

      <label>
        예산:
        <select onChange={(e) => handleChange("budget", e.target.value)}>
          <option value="">선택</option>
          <option value="low">저가</option>
          <option value="mid">중간</option>
          <option value="high">고가</option>
        </select>
      </label>

      <button type="submit">제출하기</button>
    </form>
  );
}
