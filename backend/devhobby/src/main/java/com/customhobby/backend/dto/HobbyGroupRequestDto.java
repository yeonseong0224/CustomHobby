package com.customhobby.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HobbyGroupRequestDto {
    private String groupName;
    private String groupDescription;
    private String meetingType;
    private String locationLink;
    private Integer participationFee;
    private String materials;
    private String reviewBoard;
    private String customTab;
    private String creatorId;
    private String category;
    private String meetingDate;
    private String hobbyName;
}
