package com.customhobby.backend.service;

import com.customhobby.backend.dto.RecommendationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String AI_SERVER_URL = "https://customhobby.onrender.com/recommend";

    public RecommendationResponse getRecommendations(Map<String, String> surveyData) {
        try {
            RecommendationResponse response = restTemplate.postForObject(
                    AI_SERVER_URL,
                    surveyData,
                    RecommendationResponse.class
            );
            return response;
        } catch (Exception e) {
            System.err.println("❌ AI 서버 호출 실패: " + e.getMessage());
            throw new RuntimeException("AI 추천 서비스와 통신 중 오류가 발생했습니다.");
        }
    }
}