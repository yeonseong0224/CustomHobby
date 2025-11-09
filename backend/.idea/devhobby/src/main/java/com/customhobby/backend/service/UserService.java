package com.customhobby.backend.service;

import com.customhobby.backend.domain.User;
import com.customhobby.backend.dto.UserRequestDto;
import com.customhobby.backend.dto.LoginRequestDto;
import com.customhobby.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        System.out.println("🔍 회원가입 요청 데이터:");
        System.out.println("  - userId: " + request.getUserId());
        System.out.println("  - email: " + request.getEmail());
        System.out.println("  - nickname: " + request.getNickname());
        System.out.println("  - phoneNum: " + request.getPhoneNum());
        System.out.println("  - age: " + request.getAge());
        System.out.println("  - region: " + request.getRegion());

        User user = User.builder()
                .userId(request.getUserId())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .nickname(request.getNickname())
                .age(request.getAge())
                .region(request.getRegion())
                .phoneNum(request.getPhoneNum())  // ✅ camelCase로 통일
                .build();

        User savedUser = userRepository.save(user);
        System.out.println("✅ 저장된 전화번호: " + savedUser.getPhoneNum());

        return savedUser;
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

    // 아이디 중복 체크
    public boolean isUserIdAvailable(String userId) {
        return userRepository.findByUserId(userId).isEmpty();
    }

    // 사용자 정보 업데이트 (자기소개, 프로필 사진, 전화번호 등)
    @Transactional
    public User updateUserProfile(String userId, String introduce, String profile, String phoneNum) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자 ID입니다."));

        if (introduce != null && !introduce.isEmpty()) {
            user.setIntroduce(introduce);
        }
        if (profile != null && !profile.isEmpty()) {
            user.setProfile(profile);
        }
        if (phoneNum != null && !phoneNum.isEmpty()) {
            user.setPhoneNum(phoneNum);
        }

        return userRepository.save(user);
    }
}
