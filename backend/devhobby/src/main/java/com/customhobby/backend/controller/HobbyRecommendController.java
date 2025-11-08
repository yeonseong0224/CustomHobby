package com.customhobby.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class HobbyRecommendController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<?> getRecommendations(@RequestBody Map<String, Object> userInput) {
        String flaskUrl = "http://127.0.0.1:5000/recommend";
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, userInput, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Flask 추천 서버와의 통신에 실패했습니다."));
        }
    }
}
