import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitSurvey } from "../api/surveyApi";
import { getPersonalizedRecommendations } from "../api/recommendApi";  // ✅ 추가
import "../styles/SurveyPage.css";

export default function SurveyPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [answers, setAnswers] = useState({
    gender: "",
    ageGroup: "",
    preferredPlace: "",
    propensity: "",
    budget: "",
    currentHobbies: "없음",
    hobbyTime: "",
    timePerDay: "",
    frequency: "",
    goal: "",
    sociality: ""
  });

  useEffect(() => {
    console.log("📍 SurveyPage 로드됨");
    console.log("👤 현재 user 상태:", user);
    
    if (!user || !user.userId) {
      const storedUserId = localStorage.getItem("userId");
      const storedUserNickname = localStorage.getItem("userNickname");
      
      console.log("📦 localStorage 확인:", { userId: storedUserId, nickname: storedUserNickname });
      
      if (storedUserId && storedUserNickname) {
        console.log("✅ localStorage에서 사용자 정보 복구!");
        updateUser({
          userId: storedUserId,
          nickname: storedUserNickname
        });
      } else {
        console.error("❌ 사용자 정보 없음 - 로그인 페이지로 이동");
        alert("로그인이 필요합니다!");
        navigate("/");
      }
    }
  }, [user, updateUser, navigate]);

  const handleChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🧠 설문 결과:", answers);

    try {
      // ✅ 사용자 정보 확인
      if (!user || !user.userId) {
        alert("로그인이 필요합니다!");
        console.error("❌ 사용자 정보가 없습니다!");
        navigate("/");
        return;
      }
      console.log("✅ 사용자 정보:", user);

      // ✅ 모든 필드 확인
      const emptyFields = Object.entries(answers).filter(([key, value]) => !value);
      if (emptyFields.length > 0) {
        alert("모든 질문에 답변해주세요!");
        return;
      }

      // ✅ 1단계: DB에 설문조사 저장
      const surveyData = {
        userId: user.userId,
        ...answers
      };
      await submitSurvey(surveyData);
      console.log("✅ 설문조사 DB 저장 완료");

      // ✅ 2단계: AI 추천 받기 (camelCase → snake_case 변환)
      const aiRequestData = {
        gender: answers.gender,
        age_group: answers.ageGroup,  // ✅ 변환
        preferred_place: answers.preferredPlace,  // ✅ 변환
        propensity: answers.propensity,
        budget: answers.budget,
        hobby_time: answers.hobbyTime,  // ✅ 변환
        time_per_day: answers.timePerDay,  // ✅ 변환
        frequency: answers.frequency,
        goal: answers.goal,
        sociality: answers.sociality
      };

      console.log("🤖 AI 추천 요청 중...", aiRequestData);
      const recommendations = await getPersonalizedRecommendations(aiRequestData);
      
      console.log("🎯 추천된 취미 IDs:", recommendations.recommended_ids);
      console.log("🎯 추천된 취미 이름:", recommendations.recommended_hobbies);

      // ✅ 3단계: 설문조사 완료 상태 업데이트
      updateUser({
        hasSurvey: true
      });

      // ✅ 4단계: 추천 결과를 localStorage에 저장 (다른 페이지에서 사용 가능)
      if (recommendations.recommended_ids && recommendations.recommended_ids.length > 0) {
        localStorage.setItem("recommendedHobbyIds", JSON.stringify(recommendations.recommended_ids));
        localStorage.setItem("recommendedHobbyNames", JSON.stringify(recommendations.recommended_hobbies));
      }

      alert("설문이 제출되었습니다! 추천 결과를 확인하세요.");
      
      // ✅ 5단계: 추천 페이지 또는 메인 페이지로 이동
      // 옵션 1: 추천 페이지가 있다면
      // navigate("/recommended-hobby");
      
      // 옵션 2: 메인 페이지로 이동
      navigate("/main");

    } catch (error) {
      console.error("❌ 설문 제출 또는 AI 추천 실패:", error);
      
      // AI 추천 실패해도 설문은 저장되었으므로 메인으로 이동할지 묻기
      const goToMain = window.confirm(
        "설문은 저장되었지만 AI 추천에 실패했습니다. 메인 페이지로 이동하시겠습니까?"
      );
      
      if (goToMain) {
        updateUser({ hasSurvey: true });
        navigate("/main");
      }
    }
  };

  return (
    <div className="survey-container">
      <h1>🎯 취미 성향 설문조사</h1>
      <form onSubmit={handleSubmit}>
        {/* 1. 성별 */}
        <div className="question">
          <h3>1. 성별을 선택해주세요(*)</h3>
          <label><input type="radio" name="gender" value="남성" onChange={(e)=>handleChange("gender", e.target.value)} required /> 남성</label>
          <label><input type="radio" name="gender" value="여성" onChange={(e)=>handleChange("gender", e.target.value)} /> 여성</label>
        </div>

        {/* 2. 연령대 */}
        <div className="question">
          <h3>2. 연령대를 선택해주세요(*)</h3>
          <label><input type="radio" name="ageGroup" value="10대" onChange={(e)=>handleChange("ageGroup", e.target.value)} required /> 10대</label>
          <label><input type="radio" name="ageGroup" value="20대 초·중반" onChange={(e)=>handleChange("ageGroup", e.target.value)} /> 20대 초·중반</label>
          <label><input type="radio" name="ageGroup" value="20대 후반" onChange={(e)=>handleChange("ageGroup", e.target.value)} /> 20대 후반</label>
          <label><input type="radio" name="ageGroup" value="30대" onChange={(e)=>handleChange("ageGroup", e.target.value)} /> 30대</label>
          <label><input type="radio" name="ageGroup" value="40·50대 이상" onChange={(e)=>handleChange("ageGroup", e.target.value)} /> 40·50대 이상</label>
        </div>

        {/* 3. 선호 장소 */}
        <div className="question">
          <h3>3. 취미 활동을 선호하는 장소는 어디인가요?(*)</h3>
          <label><input type="radio" name="preferredPlace" value="실내" onChange={(e)=>handleChange("preferredPlace", e.target.value)} required /> 실내</label>
          <label><input type="radio" name="preferredPlace" value="실외" onChange={(e)=>handleChange("preferredPlace", e.target.value)} /> 실외</label>
          <label><input type="radio" name="preferredPlace" value="상관없음" onChange={(e)=>handleChange("preferredPlace", e.target.value)} /> 상관없음</label>
        </div>

        {/* 4. 활동 성향 */}
        <div className="question">
          <h3>4. 취미 활동 성향은 어떤 편인가요?(*)</h3>
          <label><input type="radio" name="propensity" value="창의적" onChange={(e)=>handleChange("propensity", e.target.value)} required /> 창의적</label>
          <label><input type="radio" name="propensity" value="활동적" onChange={(e)=>handleChange("propensity", e.target.value)} /> 활동적</label>
          <label><input type="radio" name="propensity" value="정적인" onChange={(e)=>handleChange("propensity", e.target.value)} /> 정적인</label>
          <label><input type="radio" name="propensity" value="사교적인" onChange={(e)=>handleChange("propensity", e.target.value)} /> 사교적인</label>
        </div>

        {/* 5. 투자 시간 */}
        <div className="question">
          <h3>5. 하루에 취미 활동에 투자할 수 있는 시간은 얼마나 되나요?(*)</h3>
          <label><input type="radio" name="timePerDay" value="30분" onChange={(e)=>handleChange("timePerDay", e.target.value)} required /> 30분</label>
          <label><input type="radio" name="timePerDay" value="1시간" onChange={(e)=>handleChange("timePerDay", e.target.value)} /> 1시간</label>
          <label><input type="radio" name="timePerDay" value="2시간" onChange={(e)=>handleChange("timePerDay", e.target.value)} /> 2시간</label>
          <label><input type="radio" name="timePerDay" value="3시간 이상" onChange={(e)=>handleChange("timePerDay", e.target.value)} /> 3시간 이상</label>
          <label><input type="radio" name="timePerDay" value="상관없음" onChange={(e)=>handleChange("timePerDay", e.target.value)} /> 상관없음</label>
        </div>

        {/* 6. 활동 주기 */}
        <div className="question">
          <h3>6. 취미 활동 주기를 어느 정도로 하고 싶나요?(*)</h3>
          <label><input type="radio" name="frequency" value="매일" onChange={(e)=>handleChange("frequency", e.target.value)} required /> 매일</label>
          <label><input type="radio" name="frequency" value="주 2~3회" onChange={(e)=>handleChange("frequency", e.target.value)} /> 주 2~3회</label>
          <label><input type="radio" name="frequency" value="주 1회" onChange={(e)=>handleChange("frequency", e.target.value)} /> 주 1회</label>
          <label><input type="radio" name="frequency" value="월 2~3회" onChange={(e)=>handleChange("frequency", e.target.value)} /> 월 2~3회</label>
          <label><input type="radio" name="frequency" value="가끔" onChange={(e)=>handleChange("frequency", e.target.value)} /> 가끔</label>
        </div>

        {/* 7. 시간대 */}
        <div className="question">
          <h3>7. 취미를 즐기고 싶은 시간대는 언제인가요?(*)</h3>
          <label><input type="radio" name="hobbyTime" value="새벽" onChange={(e)=>handleChange("hobbyTime", e.target.value)} required /> 새벽</label>
          <label><input type="radio" name="hobbyTime" value="오전" onChange={(e)=>handleChange("hobbyTime", e.target.value)} /> 오전</label>
          <label><input type="radio" name="hobbyTime" value="오후" onChange={(e)=>handleChange("hobbyTime", e.target.value)} /> 오후</label>
          <label><input type="radio" name="hobbyTime" value="저녁" onChange={(e)=>handleChange("hobbyTime", e.target.value)} /> 저녁</label>
          <label><input type="radio" name="hobbyTime" value="상관없음" onChange={(e)=>handleChange("hobbyTime", e.target.value)} /> 상관없음</label>
        </div>

        {/* 8. 예산 */}
        <div className="question">
          <h3>8. 취미 활동에 사용할 수 있는 월 예산은 어느 정도인가요?(*)</h3>
          <label><input type="radio" name="budget" value="무예산 (0원)" onChange={(e)=>handleChange("budget", e.target.value)} required /> 무예산 (0원)</label>
          <label><input type="radio" name="budget" value="저예산 (~5만원)" onChange={(e)=>handleChange("budget", e.target.value)} /> 저예산 (~5만원)</label>
          <label><input type="radio" name="budget" value="중간 (5~15만원)" onChange={(e)=>handleChange("budget", e.target.value)} /> 중간 (5~15만원)</label>
          <label><input type="radio" name="budget" value="고예산 (15만원~)" onChange={(e)=>handleChange("budget", e.target.value)} /> 고예산 (15만원~)</label>
          <label><input type="radio" name="budget" value="상관없음" onChange={(e)=>handleChange("budget", e.target.value)} /> 상관없음</label>
        </div>

        {/* 9. 목적 */}
        <div className="question">
          <h3>9. 취미 활동을 통해 얻고 싶은 것은 무엇인가요?(*)</h3>
          <label><input type="radio" name="goal" value="스트레스 해소" onChange={(e)=>handleChange("goal", e.target.value)} required /> 스트레스 해소</label>
          <label><input type="radio" name="goal" value="자기계발" onChange={(e)=>handleChange("goal", e.target.value)} /> 자기계발</label>
          <label><input type="radio" name="goal" value="사회적 교류" onChange={(e)=>handleChange("goal", e.target.value)} /> 사회적 교류</label>
          <label><input type="radio" name="goal" value="건강관리" onChange={(e)=>handleChange("goal", e.target.value)} /> 건강관리</label>
        </div>

        {/* 10. 혼자/함께 */}
        <div className="question">
          <h3>10. 혼자 하는 취미 활동을 선호하시나요, 함께 하는 취미 활동을 선호하시나요?(*)</h3>
          <label><input type="radio" name="sociality" value="혼자" onChange={(e)=>handleChange("sociality", e.target.value)} required /> 혼자</label>
          <label><input type="radio" name="sociality" value="함께" onChange={(e)=>handleChange("sociality", e.target.value)} /> 함께</label>
          <label><input type="radio" name="sociality" value="상관없음" onChange={(e)=>handleChange("sociality", e.target.value)} /> 상관없음</label>
        </div>

        <button type="submit">제출하기</button>
      </form>
    </div>
  );
}