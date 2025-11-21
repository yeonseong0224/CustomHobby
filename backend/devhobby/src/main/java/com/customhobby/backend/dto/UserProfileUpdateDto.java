package com.customhobby.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileUpdateDto {

    @Size(max = 500, message = "자기소개는 500자 이하여야 합니다")
    private String introduce;

    @Size(max = 10485760, message = "프로필 사진 용량이 너무 큽니다")
    private String profile;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "전화번호는 10~11자리 숫자만 입력 가능합니다")
    private String phoneNum;
}
