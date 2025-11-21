package com.customhobby.backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HobbyRequestDto {
    private String hobbyName;
    private String hobbyCategory;
    private String description;
    private String oneLineDescription;
    private String meetingType; // online, offline, hybrid
    private String locationLink;
    private LocalDate meetingDate;
    private Integer participationFee;
    private String materials;
    private String haveMaterial;
    private String creatorId;  // User의 userId (String)를 참조
}


