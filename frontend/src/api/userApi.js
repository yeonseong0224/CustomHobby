import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/users"; 

// 회원가입
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};

// 로그인
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, loginData);
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};

// 사용자 정보 조회 (마이페이지용)
export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    // console.error("사용자 정보 불러오기 실패:", error);
    throw error;
  }
};

// 아이디 중복 체크
export const checkUserIdAvailable = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/check/${userId}`);
    return response.data; // true: 사용 가능, false: 중복
  } catch (error) {
    // console.error("아이디 중복 체크 실패:", error);
    throw error;
  }
};

// 사용자 프로필 업데이트 (자기소개, 프로필 사진, 전화번호)
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${userId}/profile`,
      profileData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    // console.error("프로필 업데이트 실패:", error);
    throw error;
  }
};
// 사용자 기본 정보 수정 (닉네임, 지역, 나이 등)
export const updateUserInfo = async (userId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${userId}`, updatedData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    // console.error("사용자 정보 수정 실패:", error);
    throw error;
  }
};
