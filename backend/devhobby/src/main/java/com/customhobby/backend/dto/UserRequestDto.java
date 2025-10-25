package com.customhobby.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDto {
    private String userId;
    private String password;
    private String email;
    private String nickname;
    private Integer age;
    private String region;
    private String phonenum;
}
