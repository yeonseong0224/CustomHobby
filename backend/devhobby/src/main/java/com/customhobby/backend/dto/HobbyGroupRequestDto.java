package com.customhobby.backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HobbyGroupRequestDto {
    private String groupName;
    private String groupDescription;
    private String category; // 카테고리
    private String meetingType; // online, offline, hybrid
    private String locationLink;
    private LocalDate meetingDate; // 모임 날짜
    private Integer participationFee;
    private String materials;
    private String creatorId;  // ✅ User의 userId (String)를 참조
}


