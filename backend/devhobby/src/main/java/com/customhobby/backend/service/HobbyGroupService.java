package com.customhobby.backend.service;

import com.customhobby.backend.domain.HobbyGroup;
import com.customhobby.backend.domain.UserParticipatedGroup;
import com.customhobby.backend.dto.HobbyGroupRequestDto;
import com.customhobby.backend.dto.HobbyGroupResponseDto;
import com.customhobby.backend.repository.HobbyGroupRepository;
import com.customhobby.backend.repository.UserParticipatedGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HobbyGroupService {

    private final HobbyGroupRepository hobbyGroupRepository;
    private final UserParticipatedGroupRepository userParticipatedGroupRepository;

    // 모임 개설
    @Transactional
    public HobbyGroupResponseDto createGroup(HobbyGroupRequestDto request) {
        HobbyGroup group = HobbyGroup.builder()
                .groupName(request.getGroupName())
                .groupDescription(request.getGroupDescription())
                .meetingType(request.getMeetingType())
                .locationLink(request.getLocationLink())
                .participationFee(request.getParticipationFee())
                .materials(request.getMaterials())
                .category(request.getCategory())
                .meetingDate(request.getMeetingDate())
                .creatorId(request.getCreatorId())
                .build();

        HobbyGroup saved = hobbyGroupRepository.save(group);
        
        // 개설자 자동 참여
        UserParticipatedGroup participation = UserParticipatedGroup.builder()
                .userId(request.getCreatorId())
                .groupId(saved.getId())
                .build();
        userParticipatedGroupRepository.save(participation);

        return new HobbyGroupResponseDto(saved);
    }

    // 모든 모임 조회
    @Transactional(readOnly = true)
    public List<HobbyGroupResponseDto> getAllGroups() {
        return hobbyGroupRepository.findAll()
                .stream()
                .map(HobbyGroupResponseDto::new)
                .collect(Collectors.toList());
    }

    // 모임 상세 조회
    @Transactional(readOnly = true)
    public HobbyGroupResponseDto getGroup(Long id) {
        HobbyGroup group = hobbyGroupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 모임입니다."));
        return new HobbyGroupResponseDto(group);
    }

    // 모임 참여
    @Transactional
    public void participateGroup(String userId, Long groupId) {  // ✅ String userId
        // 모임 존재 여부 확인
        if (!hobbyGroupRepository.existsById(groupId)) {
            throw new IllegalArgumentException("존재하지 않는 모임입니다.");
        }

        UserParticipatedGroup participation = UserParticipatedGroup.builder()
                .userId(userId)
                .groupId(groupId)
                .build();

        userParticipatedGroupRepository.save(participation);
    }

    // 사용자가 참여한 모임 목록 조회
    @Transactional(readOnly = true)
    public List<HobbyGroupResponseDto> getUserParticipatedGroups(String userId) {  // ✅ String userId
        List<Long> groupIds = userParticipatedGroupRepository.findByUserId(userId)
                .stream()
                .map(UserParticipatedGroup::getGroupId)
                .collect(Collectors.toList());

        return hobbyGroupRepository.findAllById(groupIds)
                .stream()
                .map(HobbyGroupResponseDto::new)
                .collect(Collectors.toList());
    }

    // 사용자가 개설한 모임 목록 조회
    @Transactional(readOnly = true)
    public List<HobbyGroupResponseDto> getUserCreatedGroups(String creatorId) {  // ✅ String creatorId
        return hobbyGroupRepository.findByCreatorId(creatorId)
                .stream()
                .map(HobbyGroupResponseDto::new)
                .collect(Collectors.toList());
    }
}


