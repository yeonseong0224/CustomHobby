package com.customhobby.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateDto {
    // userId, password, email은 없음! (수정 불가)

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
