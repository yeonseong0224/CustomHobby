package com.customhobby.backend.controller;

import com.customhobby.backend.dto.SurveyRequestDto;
import com.customhobby.backend.dto.SurveyResponseDto;
import com.customhobby.backend.service.SurveyService;
import com.customhobby.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/surveys")
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;
    private final UserService userService;

    // 설문조사 제출 시 survey 테이블 저장 + user 테이블 업데이트
    @PostMapping("/submit")
    public SurveyResponseDto submitSurvey(@RequestBody SurveyRequestDto request) {
        System.out.println("📝 [설문 제출] userId=" + request.getUserId());

        // 1. survey 테이블 저장
        SurveyResponseDto response = surveyService.submitSurvey(request);

        // 2. user 테이블에도 설문정보 업데이트 (Flask 연동용)
        userService.updateUserSurvey(request);

        System.out.println("설문이 user 테이블에도 반영되었습니다!");
        return response;
    }
}
