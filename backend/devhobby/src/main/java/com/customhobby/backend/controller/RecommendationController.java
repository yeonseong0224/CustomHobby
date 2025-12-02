package com.customhobby.backend.controller;

import com.customhobby.backend.dto.RecommendationResponse;
import com.customhobby.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping
    public RecommendationResponse getRecommendations(@RequestBody Map<String, String> surveyData) {
        return recommendationService.getRecommendations(surveyData);
    }
}