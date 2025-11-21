package com.customhobby.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "hobbies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hobby {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String hobbyName;

    @Column(nullable = false, length = 100)
    private String hobbyCategory; // 예술/공예, 야외활동, 음악/공연, 요리/음식

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String oneLineDescription;

    @Column(nullable = false, length = 50)
    private String meetingType; // online, offline, hybrid

    @Column(length = 500)
    private String locationLink;

    @Column
    private LocalDate meetingDate;

    @Column(nullable = false)
    private Integer participationFee;

    @Column(length = 500)
    private String materials;

    @Column(length = 500)
    private String haveMaterial;

    @Column(length = 2000)
    private String reviewBoard;

    @Column(length = 1000)
    private String customTab;

    @Column(name = "creator_id", length = 30)
    private String creatorId;  // User의 userId (String)를 참조

    // ✅ 새로 추가해야 하는 부분
    @Column(columnDefinition = "TEXT")
    private String photo;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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
