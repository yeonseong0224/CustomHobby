package com.customhobby.backend.dto;

import lombok.*;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyResponseDto {
    private String userId;  // user_id (PRIMARY KEY)
    private Long surveyId;  // nullable (더 이상 사용하지 않음)
    private Map<String, String> answers;  // 필드명 -> 값 매핑
}
