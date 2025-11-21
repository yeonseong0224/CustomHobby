package com.customhobby.backend.service;

import com.customhobby.backend.entity.Hobby;
import com.customhobby.backend.entity.UserParticipatedHobby;
import com.customhobby.backend.dto.HobbyRequestDto;
import com.customhobby.backend.dto.HobbyResponseDto;
import com.customhobby.backend.repository.HobbyRepository;
import com.customhobby.backend.repository.UserParticipatedHobbyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HobbyService {

    private final HobbyRepository hobbyRepository;
    private final UserParticipatedHobbyRepository userParticipatedHobbyRepository;

    // 취미 생성
    @Transactional
    public HobbyResponseDto createHobby(HobbyRequestDto request) {
        Hobby hobby = Hobby.builder()
                .hobbyName(request.getHobbyName())
                .hobbyCategory(request.getHobbyCategory())
                .description(request.getDescription())
                .oneLineDescription(request.getOneLineDescription())
                .meetingType(request.getMeetingType())
                .locationLink(request.getLocationLink())
                .meetingDate(request.getMeetingDate())
                .participationFee(request.getParticipationFee())
                .materials(request.getMaterials())
                .haveMaterial(request.getHaveMaterial())
                .creatorId(request.getCreatorId())
                .build();

        Hobby saved = hobbyRepository.save(hobby);
        return new HobbyResponseDto(saved);
    }

    // 모든 취미 조회
    @Transactional(readOnly = true)
    public List<HobbyResponseDto> getAllHobbies() {
        return hobbyRepository.findAll()
                .stream()
                .map(HobbyResponseDto::new)
                .collect(Collectors.toList());
    }

    // ✅ 카테고리별 취미 조회
    @Transactional(readOnly = true)
    public List<HobbyResponseDto> getHobbiesByCategory(String category) {
        return hobbyRepository.findByHobbyCategory(category)
                .stream()
                .map(HobbyResponseDto::new)
                .collect(Collectors.toList());
    }

    // ✅ 취미 상세 조회 (ID 기반)
    @Transactional(readOnly = true)
    public HobbyResponseDto getHobby(Long id) {
        Hobby hobby = hobbyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 취미입니다."));
        return new HobbyResponseDto(hobby);
    }

    // ✅ 취미 이름 기반 조회 (결과 없을 때 예외 대신 빈 리스트 반환)
    @Transactional(readOnly = true)
    public List<Hobby> findByHobbyName(String hobbyName) {
        if (hobbyName == null || hobbyName.isBlank()) {
            throw new IllegalArgumentException("취미 이름이 비어 있습니다.");
        }

        List<Hobby> hobbies = hobbyRepository.findByHobbyName(hobbyName);

        // ⚠️ 결과가 없더라도 예외를 던지지 않고 빈 리스트 반환
        if (hobbies.isEmpty()) {
            System.out.println("⚠️ 해당 이름의 취미를 찾을 수 없습니다: " + hobbyName);
            return List.of();
        }

        return hobbies;
    }

    // ✅ 취미 참여
    @Transactional
    public void participateHobby(String userId, Long hobbyId) {
        if (!hobbyRepository.existsById(hobbyId)) {
            throw new IllegalArgumentException("존재하지 않는 취미입니다.");
        }

        if (userParticipatedHobbyRepository.existsByUserIdAndHobbyId(userId, hobbyId)) {
            throw new IllegalStateException("이미 참여한 취미입니다.");
        }

        UserParticipatedHobby participation = UserParticipatedHobby.builder()
                .userId(userId)
                .hobbyId(hobbyId)
                .build();

        userParticipatedHobbyRepository.save(participation);
    }

    // ✅ 사용자가 참여한 취미 목록 조회
    @Transactional(readOnly = true)
    public List<HobbyResponseDto> getUserParticipatedHobbies(String userId) {
        List<Long> hobbyIds = userParticipatedHobbyRepository.findByUserId(userId)
                .stream()
                .map(UserParticipatedHobby::getHobbyId)
                .collect(Collectors.toList());

        return hobbyRepository.findAllById(hobbyIds)
                .stream()
                .map(HobbyResponseDto::new)
                .collect(Collectors.toList());
    }

    // ✅ 사용자가 개설한 취미 목록 조회
    @Transactional(readOnly = true)
    public List<HobbyResponseDto> getUserCreatedHobbies(String creatorId) {
        return hobbyRepository.findByCreatorId(creatorId)
                .stream()
                .map(HobbyResponseDto::new)
                .collect(Collectors.toList());
    }
}
