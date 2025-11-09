package com.customhobby.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "hobby_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HobbyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String groupName;

    @Column(length = 1000)
    private String groupDescription;

    @Column(length = 100)
    private String category; // 카테고리 (음악, 운동, 예술, 요리, 독서, 기타 등)

    @Column(nullable = false, length = 255)
    private String meetingType; // online, offline, hybrid

    @Column(length = 500)
    private String locationLink;

    @Column
    private LocalDate meetingDate; // 모임 날짜

    @Column(nullable = false)
    private Integer participationFee;

    @Column(length = 500)
    private String materials;

    @Column(length = 2000)
    private String reviewBoard;

    @Column(length = 1000)
    private String customTab;

    @Column(length = 100)
    private String category;

    @Column(length = 100)
    private String meetingDate;  // 모임 날짜

    @Column(name = "creator_id", length = 30)
    private String creatorId;  // ✅ User의 userId (String)를 참조

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
