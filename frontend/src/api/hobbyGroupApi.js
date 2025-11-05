import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/hobby-groups";

// 모임 개설
export const createHobbyGroup = async (groupData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, groupData);
    return response.data;
  } catch (error) {
    console.error("❌ 모임 개설 실패:", error);
    throw error;
  }
};

// 모든 모임 조회
export const getAllHobbyGroups = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("❌ 모임 목록 조회 실패:", error);
    throw error;
  }
};

// 모임 상세 조회
export const getHobbyGroup = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ 모임 상세 조회 실패:", error);
    throw error;
  }
};

// 모임 참여
export const participateHobbyGroup = async (groupId, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${groupId}/participate?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ 모임 참여 실패:", error);
    throw error;
  }
};

// 사용자가 참여한 모임 목록 조회
export const getUserParticipatedGroups = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/participated`);
    return response.data;
  } catch (error) {
    console.error("❌ 참여한 모임 조회 실패:", error);
    throw error;
  }
};

// 사용자가 개설한 모임 목록 조회
export const getUserCreatedGroups = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/created`);
    return response.data;
  } catch (error) {
    console.error("❌ 개설한 모임 조회 실패:", error);
    throw error;
  }
};











