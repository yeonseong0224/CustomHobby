package com.customhobby.backend.dto;

import com.customhobby.backend.domain.User;
import lombok.Getter;

@Getter
public class UserResponseDto {
    private String userId;      // PRIMARY KEY
    private String email;
    private String nickname;
    private String region;
    private Integer age;
    private String introduce;   // 자기소개
    private String profile;     // 프로필 사진 (Base64 또는 URL)
    private String phoneNum;    // 전화번호

    private boolean hasSurvey;  // ✅ 설문조사 완료 여부

    // ✅ 설문조사 응답 필드 추가
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

    public UserResponseDto(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.region = user.getRegion();
        this.age = user.getAge();
        this.introduce = user.getIntroduce();
        this.profile = user.getProfile();
        this.phoneNum = user.getPhoneNum();

        // ✅ 설문조사 필드 포함
        this.gender = user.getGender();
        this.ageGroup = user.getAgeGroup();
        this.preferredPlace = user.getPreferredPlace();
        this.propensity = user.getPropensity();
        this.budget = user.getBudget();
        this.currentHobbies = user.getCurrentHobbies();
        this.hobbyTime = user.getHobbyTime();
        this.timePerDay = user.getTimePerDay();
        this.frequency = user.getFrequency();
        this.goal = user.getGoal();
        this.sociality = user.getSociality();

        // ✅ 설문 완료 여부 판단
        this.hasSurvey = user.getGender() != null && !user.getGender().isEmpty();
    }
}
