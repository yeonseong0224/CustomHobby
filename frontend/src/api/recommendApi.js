// ============================================================
// 📘 recommendApi.js (완성형)
// React → Spring Boot(8080) → Flask(5000) 추천 API 연동
// ============================================================

import axios from "axios";

// ✅ Spring Boot의 중계 API 주소
const SPRING_API_URL = "http://localhost:8080/api/recommend";

/**
 * 🧩 사용자 설문 응답(userData)을 Spring Boot를 통해 Flask로 전송하고
 * 추천 결과(취미명 배열)를 반환하는 함수
 *
 * @param {Object} userData - React 설문 페이지에서 수집한 사용자 응답
 * @returns {Array<string>} 추천된 취미 목록
 */
export const getHobbyRecommendations = async (userData) => {
  try {
    console.log("📤 Spring Boot로 전송 중:", userData);

    // Flask로 바로 보내는 게 아니라 Spring Boot가 중간에서 Flask로 전달함
    const response = await axios.post(SPRING_API_URL, userData, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000, // 10초 제한 (Flask 응답 지연 시 에러 방지)
    });

    console.log("🔥 Flask 응답 수신:", response.data);

    // Flask에서 오는 데이터 형식: { recommended_hobbies: [...], recommended_ids: [...] }
    if (response.data && Array.isArray(response.data.recommended_hobbies)) {
      return response.data.recommended_hobbies;
    }

    console.warn("⚠️ Flask 응답 형식이 예상과 다릅니다:", response.data);
    return [];
  } catch (error) {
    console.error("❌ 추천 API 호출 실패:", error.message || error);

    // 네트워크 에러 / Flask 미실행 시 구분 로그
    if (error.response) {
      console.error("서버 응답 코드:", error.response.status);
      console.error("서버 응답 데이터:", error.response.data);
    } else if (error.request) {
      console.error("서버 응답 없음 (Flask 서버 미실행 또는 포트 오류)");
    }

    return [];
  }
};

/**
 * 🔁 추천 결과를 콘솔에 예쁘게 출력하는 헬퍼 함수 (선택사항)
 */
export const showRecommendations = (list) => {
  if (!Array.isArray(list) || list.length === 0) {
    console.log("😢 추천된 취미가 없습니다.");
    return;
  }

  console.log("🎯 추천된 취미 목록:");
  list.forEach((hobby, idx) => {
    console.log(`${idx + 1}. ${hobby}`);
  });
};
