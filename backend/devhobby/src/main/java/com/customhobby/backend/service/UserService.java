package com.customhobby.backend.service;

import com.customhobby.backend.domain.User;
import com.customhobby.backend.dto.UserRequestDto;
import com.customhobby.backend.dto.LoginRequestDto;
import com.customhobby.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 회원가입
    public User register(UserRequestDto request) {
        if (userRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다.");
        }

        User user = User.builder()
                .userId(request.getUserId())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .nickname(request.getNickname())
                .age(request.getAge())
                .region(request.getRegion())
                .build();

        return userRepository.save(user);
    }

    // 로그인
    public User login(LoginRequestDto request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자 ID입니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 🔍 디버깅: User 객체 확인
        System.out.println("🔍 로그인 성공! User 정보:");
        System.out.println("  - userId: " + user.getUserId());
        System.out.println("  - nickname: " + user.getNickname());
        System.out.println("  - email: " + user.getEmail());

        return user;
    }

    // 유저 조회
    public Optional<User> findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }
}
