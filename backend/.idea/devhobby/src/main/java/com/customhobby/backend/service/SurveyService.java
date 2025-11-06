package com.customhobby.backend.service;

import com.customhobby.backend.domain.User;
import com.customhobby.backend.dto.SurveyRequestDto;
import com.customhobby.backend.dto.SurveyResponseDto;
import com.customhobby.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final UserRepository userRepository;

    // 설문조사 제출 - users 테이블 직접 업데이트
    @Transactional
    public SurveyResponseDto submitSurvey(SurveyRequestDto request) {
        // user_id (PRIMARY KEY)로 User 찾기
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + request.getUserId()));
        
        System.out.println("🔍 설문 제출 시작 - userId: " + user.getUserId());
        System.out.println("📝 설문 데이터: gender=" + request.getGender() + ", ageGroup=" + request.getAgeGroup());
        
        // 설문 응답을 user 엔티티에 직접 저장
        user.setGender(request.getGender());
        user.setAgeGroup(request.getAgeGroup());
        user.setPreferredPlace(request.getPreferredPlace());
        user.setPropensity(request.getPropensity());
        user.setBudget(request.getBudget());
        user.setCurrentHobbies(request.getCurrentHobbies());
        user.setHobbyTime(request.getHobbyTime());
        user.setTimePerDay(request.getTimePerDay());
        user.setFrequency(request.getFrequency());
        user.setGoal(request.getGoal());
        user.setSociality(request.getSociality());
        
        // 저장 (더티 체킹으로 자동 업데이트)
        User savedUser = userRepository.save(user);
        
        System.out.println("✅ 설문 저장 완료!");
        System.out.println("✅ 저장된 데이터 확인: gender=" + savedUser.getGender() + ", ageGroup=" + savedUser.getAgeGroup());

        // 응답 DTO 반환
        Map<String, String> answers = new HashMap<>();
        answers.put("gender", user.getGender());
        answers.put("ageGroup", user.getAgeGroup());
        answers.put("preferredPlace", user.getPreferredPlace());
        answers.put("propensity", user.getPropensity());
        answers.put("budget", user.getBudget());
        answers.put("currentHobbies", user.getCurrentHobbies());
        answers.put("hobbyTime", user.getHobbyTime());
        answers.put("timePerDay", user.getTimePerDay());
        answers.put("frequency", user.getFrequency());
        answers.put("goal", user.getGoal());
        answers.put("sociality", user.getSociality());

        return SurveyResponseDto.builder()
                .userId(user.getUserId())
                .surveyId(null)
                .answers(answers)
                .build();
    }
}
