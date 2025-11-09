package com.customhobby.backend.dto;

import com.customhobby.backend.domain.User;
import lombok.Getter;

@Getter
public class UserResponseDto {
    private String userId;  // PRIMARY KEY
    private String email;
    private String nickname;
    private String region;
    private Integer age;
    private String introduce;  // 자기소개
    private String profile;    // 프로필 사진 (Base64 또는 URL)
    private String phoneNum;   // 전화번호
    private boolean hasSurvey; // ✅ 설문조사 완료 여부

    public UserResponseDto(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.region = user.getRegion();
        this.age = user.getAge();
        this.introduce = user.getIntroduce();
        this.profile = user.getProfile();
        this.phoneNum = user.getPhoneNum();
        // ✅ 설문조사 완료 여부 체크 (gender가 있으면 설문조사 완료)
        this.hasSurvey = user.getGender() != null && !user.getGender().isEmpty();
    }
}
