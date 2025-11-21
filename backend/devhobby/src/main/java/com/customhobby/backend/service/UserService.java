package com.customhobby.backend.service;

import com.customhobby.backend.entity.User;
import com.customhobby.backend.dto.UserRequestDto;
import com.customhobby.backend.dto.LoginRequestDto;
import com.customhobby.backend.dto.SurveyRequestDto;
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

        System.out.println("회원가입 요청 데이터:");
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
                .phoneNum(request.getPhoneNum())
                .build();

        User savedUser = userRepository.save(user);
        System.out.println("저장 완료: userId=" + savedUser.getUserId());
        return savedUser;
    }

    // 로그인
    public User login(LoginRequestDto request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자 ID입니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        System.out.println("로그인 성공! userId=" + user.getUserId());
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

    // 사용자 기본 정보 수정 (닉네임, 지역, 나이, 전화번호)
    @Transactional
    public User updateUserInfo(String userId, String nickname, String region, Integer age, String phoneNum) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자 ID입니다."));

        System.out.println("[UPDATE USER INFO] userId=" + userId);
        System.out.println("nickname=" + nickname +
                ", region=" + region +
                ", age=" + age +
                ", phoneNum=" + phoneNum);

        if (nickname != null && !nickname.isEmpty()) user.setNickname(nickname);
        if (region != null && !region.isEmpty()) user.setRegion(region);
        if (age != null) user.setAge(age);
        if (phoneNum != null && !phoneNum.isEmpty()) user.setPhoneNum(phoneNum);

        return userRepository.save(user);
    }

    // 사용자 프로필 업데이트 (자기소개, 프로필 사진, 전화번호)
    @Transactional
    public User updateUserProfile(String userId, String introduce, String profile, String phoneNum) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자 ID입니다."));

        System.out.println("[UPDATE PROFILE] userId=" + userId);

        if (introduce != null && !introduce.isEmpty()) user.setIntroduce(introduce);
        if (profile != null && !profile.isEmpty()) user.setProfile(profile);
        if (phoneNum != null && !phoneNum.isEmpty()) user.setPhoneNum(phoneNum);

        return userRepository.save(user);
    }

    // 설문 응답 기반으로 User 테이블 업데이트 (Flask 추천용)
    @Transactional
    public void updateUserSurvey(SurveyRequestDto request) {
        Optional<User> optionalUser = userRepository.findByUserId(request.getUserId());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            System.out.println("[UPDATE USER SURVEY DATA]");
            System.out.println("  gender=" + request.getGender());
            System.out.println("  ageGroup=" + request.getAgeGroup());
            System.out.println("  preferredPlace=" + request.getPreferredPlace());
            System.out.println("  propensity=" + request.getPropensity());
            System.out.println("  budget=" + request.getBudget());
            System.out.println("  hobbyTime=" + request.getHobbyTime());
            System.out.println("  timePerDay=" + request.getTimePerDay());
            System.out.println("  frequency=" + request.getFrequency());
            System.out.println("  goal=" + request.getGoal());
            System.out.println("  sociality=" + request.getSociality());

            // 필드별 업데이트
            user.setGender(request.getGender());
            user.setAgeGroup(request.getAgeGroup());
            user.setPreferredPlace(request.getPreferredPlace());
            user.setPropensity(request.getPropensity());
            user.setBudget(request.getBudget());
            user.setHobbyTime(request.getHobbyTime());
            user.setTimePerDay(request.getTimePerDay());
            user.setFrequency(request.getFrequency());
            user.setGoal(request.getGoal());
            user.setSociality(request.getSociality());

            userRepository.save(user);
            System.out.println("설문 정보가 User 테이블에 반영됨: userId=" + user.getUserId());
        } else {
            System.out.println("⚠해당 userId를 찾을 수 없음: " + request.getUserId());
        }
    }
}
