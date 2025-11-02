package com.customhobby.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HobbyGroupRequestDto {
    private String groupName;
    private String groupDescription;
    private String meetingType; // online, offline, hybrid
    private String locationLink;
    private Integer participationFee;
    private String materials;
    private String creatorId;  // ✅ User의 userId (String)를 참조
}


