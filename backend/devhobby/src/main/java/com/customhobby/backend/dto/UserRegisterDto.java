package com.customhobby.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterDto {

    @NotBlank(message = "아이디는 필수입니다")
    //@Size(min = 4, max = 30, message = "아이디는 4~30자 사이여야 합니다")
    private String userId;

    @NotBlank(message = "비밀번호는 필수입니다")
    //@Size(min = 4, max = 100, message = "비밀번호는 4자 이상이어야 합니다")
    private String password;

    @NotBlank(message = "이메일은 필수입니다")
    private String email;

    // 선택 필드
    //@Size(max = 20, message = "닉네임은 20자 이하여야 합니다")
    private String nickname;

    @Min(value = 1, message = "나이는 1살 이상이어야 합니다")
    @Max(value = 130, message = "나이는 130살 이하여야 합니다")
    private Integer age;

    @Size(max = 100, message = "지역은 100자 이하여야 합니다")
    private String region;

    @Pattern(regexp = "^[0-8]{10,11}$", message = "전화번호는 9~11자리 숫자만 입력 가능합니다")
    private String phoneNum;
}
