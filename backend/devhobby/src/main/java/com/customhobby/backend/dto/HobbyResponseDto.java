package com.customhobby.backend.dto;

import com.customhobby.backend.domain.Hobby;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HobbyResponseDto {
    private Long id;
    private String hobbyName;
    private String hobbyCategory;
    private String description;
    private String oneLineDescription;
    private String meetingType;
    private String locationLink;
    private LocalDate meetingDate;
    private Integer participationFee;
    private String materials;
    private String haveMaterial;
    private String reviewBoard;
    private String customTab;
    private String photo;  // ✅ 이미지 URL 또는 파일명 추가
    private String creatorId;  // ✅ User의 userId (String)를 참조
    private LocalDateTime createdAt;

    public HobbyResponseDto(Hobby hobby) {
        this.id = hobby.getId();
        this.hobbyName = hobby.getHobbyName();
        this.hobbyCategory = hobby.getHobbyCategory();
        this.description = hobby.getDescription();
        this.oneLineDescription = hobby.getOneLineDescription();
        this.meetingType = hobby.getMeetingType();
        this.locationLink = hobby.getLocationLink();
        this.meetingDate = hobby.getMeetingDate();
        this.participationFee = hobby.getParticipationFee();
        this.materials = hobby.getMaterials();
        this.haveMaterial = hobby.getHaveMaterial();
        this.reviewBoard = hobby.getReviewBoard();
        this.customTab = hobby.getCustomTab();
        this.creatorId = hobby.getCreatorId();
        this.createdAt = hobby.getCreatedAt();
        
        // ✅ 이미지 처리: DB에 이미지가 없으면 카테고리별 기본 이미지 사용
//        this.photo = getDefaultPhotoByCategory(hobby.getHobbyCategory());
        this.photo = hobby.getPhoto();//
    }
    
    // 카테고리별 기본 이미지 매핑
    private String getDefaultPhotoByCategory(String category) {
        if (category == null) return "/images/art.png";
        
        switch (category) {
            case "예술/공예":
                return "/images/art.png";
            case "야외활동":
                return "/images/outdoor.png";
            case "음악/공연":
                return "/images/music.png";
            case "요리/음식":
                return "/images/food.png";
            default:
                return "/images/art.png";
        }
    }
}


