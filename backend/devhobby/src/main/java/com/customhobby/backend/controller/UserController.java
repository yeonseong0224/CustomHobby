package com.customhobby.backend.controller;

import com.customhobby.backend.domain.User;
import com.customhobby.backend.dto.*;
import com.customhobby.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ✅ 회원가입
    @PostMapping("/register")
    public UserResponseDto register(@RequestBody UserRequestDto request) {
        User user = userService.register(request);
        return new UserResponseDto(user);
    }

    // ✅ 로그인
    @PostMapping("/login")
    public UserResponseDto login(@RequestBody LoginRequestDto request) {
        User user = userService.login(request);
        return new UserResponseDto(user);
    }

    // ✅ 유저 조회
    @GetMapping("/{userId}")
    public UserResponseDto getUser(@PathVariable String userId) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자 ID입니다."));
        return new UserResponseDto(user);
    }

    // ✅ 아이디 중복 체크
    @GetMapping("/check/{userId}")
    public boolean checkUserIdAvailable(@PathVariable String userId) {
        return userService.isUserIdAvailable(userId);
    }

    // ✅ 사용자 프로필 업데이트 (자기소개, 프로필 사진, 전화번호)
    @PutMapping("/{userId}/profile")
    public UserResponseDto updateUserProfile(
            @PathVariable String userId,
            @RequestBody UserRequestDto request) {

        System.out.println("📸 [UPDATE PROFILE] userId=" + userId);
        System.out.println("➡️ Base64 길이: " +
                (request.getProfile() != null ? request.getProfile().length() : "NULL"));

        User user = userService.updateUserProfile(
                userId,
                request.getIntroduce(),
                request.getProfile(),
                request.getPhoneNum()
        );
        return new UserResponseDto(user);
    }

    // ✅ 사용자 기본 정보 수정 (닉네임, 지역, 나이, 전화번호)
    @PutMapping("/{userId}")
    public UserResponseDto updateUserInfo(
            @PathVariable String userId,
            @RequestBody UserRequestDto request) {

        System.out.println("📝 [UPDATE USER INFO] userId=" + userId);
        System.out.println("➡️ nickname=" + request.getNickname() +
                ", region=" + request.getRegion() +
                ", age=" + request.getAge() +
                ", phoneNum=" + request.getPhoneNum());

        User updatedUser = userService.updateUserInfo(
                userId,
                request.getNickname(),
                request.getRegion(),
                request.getAge(),
                request.getPhoneNum()
        );

        return new UserResponseDto(updatedUser);
    }
}
