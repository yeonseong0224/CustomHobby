import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/hobbies";

// 취미 생성
export const createHobby = async (hobbyData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, hobbyData);
    return response.data;
  } catch (error) {
    console.error("❌ 취미 생성 실패:", error);
    throw error;
  }
};

// 모든 취미 조회
export const getAllHobbies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("❌ 취미 목록 조회 실패:", error);
    throw error;
  }
};

// 카테고리별 취미 조회
export const getHobbiesByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category/${category}`);
    return response.data;
  } catch (error) {
    console.error("❌ 카테고리별 취미 조회 실패:", error);
    throw error;
  }
};

// 취미 상세 조회
export const getHobby = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ 취미 상세 조회 실패:", error);
    throw error;
  }
};

// 취미 참여
export const participateHobby = async (hobbyId, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${hobbyId}/participate?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ 취미 참여 실패:", error);
    throw error;
  }
};

// 사용자가 참여한 취미 목록 조회
export const getUserParticipatedHobbies = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/participated`);
    return response.data;
  } catch (error) {
    console.error("❌ 참여한 취미 조회 실패:", error);
    throw error;
  }
};

// 사용자가 개설한 취미 목록 조회
export const getUserCreatedHobbies = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/created`);
    return response.data;
  } catch (error) {
    console.error("❌ 개설한 취미 조회 실패:", error);
    throw error;
  }
};






