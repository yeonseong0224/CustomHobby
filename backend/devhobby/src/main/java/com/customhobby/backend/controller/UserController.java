package com.customhobby.backend.controller;

import com.customhobby.backend.domain.User;
import com.customhobby.backend.dto.*;
import com.customhobby.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {


    private final UserService userService;


    // 회원가입
    @PostMapping("/register")
    public UserResponseDto register(@RequestBody UserRequestDto request) {
        User user = userService.register(request);
        return new UserResponseDto(user);
    }

    // 로그인
    @PostMapping("/login")
    public UserResponseDto login(@RequestBody LoginRequestDto request) {
        User user = userService.login(request);
        return new UserResponseDto(user);
    }

    // 유저 조회
    @GetMapping("/{userId}")
    public UserResponseDto getUser(@PathVariable String userId) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자 ID입니다."));
        return new UserResponseDto(user);
    }
}
