// API 기본 URL 설정
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// 각 API 엔드포인트
export const API_ENDPOINTS = {
  HOBBIES: `${API_BASE_URL}/api/hobbies`,
  USERS: `${API_BASE_URL}/api/users`,
  SURVEYS: `${API_BASE_URL}/api/surveys`,
  RECOMMEND: `${API_BASE_URL}/api/recommend`,
  HOBBY_GROUPS: `${API_BASE_URL}/api/hobby-groups`,
};

