package com.customhobby.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyRequestDto {
    private String userId;  // user_id (PRIMARY KEY)
    
    // 설문조사 응답 필드들
    private String gender;
    private String ageGroup;
    private String preferredPlace;
    private String propensity;
    private String budget;
    private String currentHobbies;
    private String hobbyTime;
    private String timePerDay;
    private String frequency;
    private String goal;
    private String sociality;
}
