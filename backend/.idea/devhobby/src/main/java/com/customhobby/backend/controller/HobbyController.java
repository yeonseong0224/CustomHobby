package com.customhobby.backend.controller;

import com.customhobby.backend.dto.HobbyRequestDto;
import com.customhobby.backend.dto.HobbyResponseDto;
import com.customhobby.backend.service.HobbyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hobbies")
@RequiredArgsConstructor
public class HobbyController {

    private final HobbyService hobbyService;

    // 취미 생성
    @PostMapping
    public HobbyResponseDto createHobby(@RequestBody HobbyRequestDto request) {
        return hobbyService.createHobby(request);
    }

    // 모든 취미 조회
    @GetMapping
    public List<HobbyResponseDto> getAllHobbies() {
        return hobbyService.getAllHobbies();
    }

    // 카테고리별 취미 조회
    @GetMapping("/category/{category}")
    public List<HobbyResponseDto> getHobbiesByCategory(@PathVariable String category) {
        return hobbyService.getHobbiesByCategory(category);
    }

    // 취미 상세 조회
    @GetMapping("/{id}")
    public HobbyResponseDto getHobby(@PathVariable Long id) {
        return hobbyService.getHobby(id);
    }

    // 취미 참여
    @PostMapping("/{hobbyId}/participate")
    public void participateHobby(@PathVariable Long hobbyId, @RequestParam String userId) {  // ✅ String userId
        hobbyService.participateHobby(userId, hobbyId);
    }

    // 사용자가 참여한 취미 목록 조회
    @GetMapping("/user/{userId}/participated")
    public List<HobbyResponseDto> getUserParticipatedHobbies(@PathVariable String userId) {  // ✅ String userId
        return hobbyService.getUserParticipatedHobbies(userId);
    }

    // 사용자가 개설한 취미 목록 조회
    @GetMapping("/user/{userId}/created")
    public List<HobbyResponseDto> getUserCreatedHobbies(@PathVariable String userId) {  // ✅ String userId
        return hobbyService.getUserCreatedHobbies(userId);
    }
}


