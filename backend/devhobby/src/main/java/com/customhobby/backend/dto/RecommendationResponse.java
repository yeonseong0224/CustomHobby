package com.customhobby.backend.dto;

import java.util.List;

public class RecommendationResponse {
    private List<Integer> recommended_ids;
    private List<String> recommended_hobbies;

    // Getter/Setter 추가
    public List<Integer> getRecommended_ids() {
        return recommended_ids;
    }

    public void setRecommended_ids(List<Integer> recommended_ids) {
        this.recommended_ids = recommended_ids;
    }

    public List<String> getRecommended_hobbies() {
        return recommended_hobbies;
    }

    public void setRecommended_hobbies(List<String> recommended_hobbies) {
        this.recommended_hobbies = recommended_hobbies;
    }
}
