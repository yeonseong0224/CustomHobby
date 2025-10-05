package com.customhobby.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users") // 실제 DB 테이블명
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    // 내부 관리용 PK (Auto Increment)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 사용자가 입력하는 ID
    @Column(nullable = false, unique = true, length = 30)
    private String userId;

    // 비밀번호 (암호화 저장)
    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    private String nickname;

    private Integer age;

    private String region;

    private String phoneNum;

    private String profile; // 프로필 사진 URL

    @Column(length = 500)
    private String introduce; // 자기소개

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // === 자동으로 가입 시간 넣어주는 설정 ===
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
