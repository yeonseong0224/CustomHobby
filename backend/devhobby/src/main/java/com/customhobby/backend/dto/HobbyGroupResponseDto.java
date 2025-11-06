package com.customhobby.backend.dto;

import com.customhobby.backend.domain.HobbyGroup;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HobbyGroupResponseDto {
    private Long id;
    private String groupName;
    private String groupDescription;
    private String category; // 카테고리
    private String meetingType;
    private String locationLink;
    private LocalDate meetingDate; // 모임 날짜
    private Integer participationFee;
    private String materials;
    private String reviewBoard;
    private String customTab;
    private String creatorId;  // ✅ User의 userId (String)를 참조
    private LocalDateTime createdAt;

    public HobbyGroupResponseDto(HobbyGroup group) {
        this.id = group.getId();
        this.groupName = group.getGroupName();
        this.groupDescription = group.getGroupDescription();
        this.category = group.getCategory();
        this.meetingType = group.getMeetingType();
        this.locationLink = group.getLocationLink();
        this.meetingDate = group.getMeetingDate();
        this.participationFee = group.getParticipationFee();
        this.materials = group.getMaterials();
        this.reviewBoard = group.getReviewBoard();
        this.customTab = group.getCustomTab();
        this.creatorId = group.getCreatorId();
        this.createdAt = group.getCreatedAt();
    }
}


