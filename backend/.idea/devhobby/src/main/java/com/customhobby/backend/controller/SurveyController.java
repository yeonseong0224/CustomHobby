package com.customhobby.backend.controller;

import com.customhobby.backend.dto.SurveyRequestDto;
import com.customhobby.backend.dto.SurveyResponseDto;
import com.customhobby.backend.service.SurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/surveys")
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;

    // 설문조사 제출
    @PostMapping("/submit")
    public SurveyResponseDto submitSurvey(@RequestBody SurveyRequestDto request) {
        return surveyService.submitSurvey(request);
    }
}
