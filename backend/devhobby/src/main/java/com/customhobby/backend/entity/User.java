package com.customhobby.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    // === 기본 회원 정보 ===
    @Id
    @Column(name = "user_id", nullable = false, unique = true, length = 30)
    private String userId;  // 사용자가 직접 입력한 ID (PK)

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "age")
    private Integer age;

    @Column(name = "region")
    private String region;

    @Column(name = "phone_num")
    private String phoneNum;

    // === 프로필 / 소개 ===
    @Column(name = "profile", columnDefinition = "TEXT")
    private String profile;


    @Column(name = "introduce", columnDefinition = "TEXT")
    private String introduce;  // 자기소개 문장 저장

    // === 설문조사 응답 필드 ===
    @Column(name = "gender", length = 50)
    private String gender;

    @Column(name = "age_group", length = 50)
    private String ageGroup;

    @Column(name = "preferred_place", length = 50)
    private String preferredPlace;

    @Column(name = "propensity", length = 50)
    private String propensity;

    @Column(name = "budget", length = 50)
    private String budget;

    @Column(name = "current_hobbies", columnDefinition = "TEXT")
    private String currentHobbies;

    @Column(name = "hobby_time", length = 50)
    private String hobbyTime;

    @Column(name = "time_per_day", length = 50)
    private String timePerDay;

    @Column(name = "frequency", length = 50)
    private String frequency;

    @Column(name = "goal", length = 100)
    private String goal;

    @Column(name = "sociality", length = 50)
    private String sociality;

    // === 생성 및 수정 시각 ===
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // === 자동 시간 설정 ===
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
