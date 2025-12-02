import axios from "axios";
import { API_ENDPOINTS } from './config';

const API_BASE_URL = API_ENDPOINTS.SURVEYS;

// 설문조사 제출
export const submitSurvey = async (surveyData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/submit`, surveyData);
    return response.data;
  } catch (error) {
    console.error("설문조사 제출 실패:", error);
    throw error;
  }
};

