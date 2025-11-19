package com.customhobby.backend.dto;

import com.customhobby.backend.domain.HobbyGroup;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HobbyGroupResponseDto {

    private Long id;
    private String groupName;
    private String groupDescription;
    private String meetingType;
    private String locationLink;
    private Integer participationFee;
    private String materials;
    private String reviewBoard;
    private String customTab;
    private String category;
    private String meetingDate;
    private String creatorId;
    private String hobbyName;   // ⭐ Long → String
    private String groupImage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public HobbyGroupResponseDto(HobbyGroup group) {
        this.id = group.getId();
        this.groupName = group.getGroupName();
        this.groupDescription = group.getGroupDescription();
        this.meetingType = group.getMeetingType();
        this.locationLink = group.getLocationLink();
        this.participationFee = group.getParticipationFee();
        this.materials = group.getMaterials();
        this.reviewBoard = group.getReviewBoard();
        this.customTab = group.getCustomTab();
        this.category = group.getCategory();
        this.meetingDate = group.getMeetingDate();
        this.creatorId = group.getCreatorId();
        this.hobbyName = group.getHobbyName(); // ⭐ 추가
        this.groupImage = group.getGroupImage();
        this.createdAt = group.getCreatedAt();
        this.updatedAt = group.getUpdatedAt();
    }
}
