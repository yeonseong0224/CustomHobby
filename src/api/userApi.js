import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/users"; // ✅ 백엔드 엔드포인트에 맞게

// 🟢 회원가입
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("❌ 회원가입 실패:", error);
    throw error;
  }
};

// 🟢 로그인
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, loginData);
    return response.data;
  } catch (error) {
    console.error("❌ 로그인 실패:", error);
    throw error;
  }
};

// 🟢 사용자 정보 조회 (마이페이지용)
export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ 사용자 정보 불러오기 실패:", error);
    throw error;
  }
};
