package com.customhobby.backend.controller;

import com.customhobby.backend.domain.User;
import com.customhobby.backend.dto.*;
import com.customhobby.backend.service.UserService;
import com.customhobby.backend.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @PostMapping("/register")
    public UserResponseDto register(@RequestBody UserRequestDto request) {
        User user = userService.register(request);
        return new UserResponseDto(user);
    }

    // 로그인
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequestDto request) {
        User user = userService.login(request);
        String token = jwtTokenProvider.createToken(user.getUserId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", new UserResponseDto(user));
        response.put("token", token);
        response.put("message", "로그인 성공");
        
        return response;
    }

    // 유저 조회 (JWT 인증 필요)
    @GetMapping("/{userId}")
    public UserResponseDto getUser(@PathVariable String userId) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자 ID입니다."));
        return new UserResponseDto(user);
    }
}
