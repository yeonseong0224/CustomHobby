package com.customhobby.backend.dto;

import com.customhobby.backend.domain.User;
import lombok.Getter;

@Getter
public class UserResponseDto {
    private String userId;
    private String email;
    private String nickname;
    private String region;
    private Integer age;

    public UserResponseDto(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.region = user.getRegion();
        this.age = user.getAge();
    }
}
