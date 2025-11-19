package com.customhobby.backend.domain;

import jakarta.persistence.*;
import lombok.*;
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

    @Column(nullable = false, length = 255)
    private String meetingType;

    @Column(length = 500)
    private String locationLink;

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
    private String meetingDate;

    @Column(name = "creator_id", length = 30)
    private String creatorId;

    @Column(name = "hobby_name", length = 100)
    private String hobbyName;

    @Column(columnDefinition = "TEXT")
    private String groupImage;

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
