package com.customhobby.backend.controller;

import com.customhobby.backend.entity.Hobby;
import com.customhobby.backend.dto.HobbyRequestDto;
import com.customhobby.backend.dto.HobbyResponseDto;
import com.customhobby.backend.service.HobbyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

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

    // 이름 기반 취미 상세 조회 (한글 완벽 지원 + 안전 예외 처리)
    @GetMapping("/name")
    public ResponseEntity<?> getHobbyByName(@RequestParam String hobbyName) {
        try {
            // URL 디코딩 (한글 깨짐 방지)
            String decodedName = URLDecoder.decode(hobbyName, StandardCharsets.UTF_8);
            List<Hobby> hobbies = hobbyService.findByHobbyName(decodedName);

            // 결과 없을 때 404 반환
            if (hobbies.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                        "message", "해당 이름의 취미가 존재하지 않습니다.",
                        "requestedName", decodedName
                ));
            }

            // 결과 정상 반환
            return ResponseEntity.ok(hobbies);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "서버 내부 오류가 발생했습니다.",
                    "details", e.getMessage()
            ));
        }
    }

    // 취미 상세 조회 (ID 기반)
    @GetMapping("/{id}")
    public HobbyResponseDto getHobby(@PathVariable Long id) {
        return hobbyService.getHobby(id);
    }

    // 취미 참여
    @PostMapping("/{hobbyId}/participate")
    public void participateHobby(@PathVariable Long hobbyId, @RequestParam String userId) {
        hobbyService.participateHobby(userId, hobbyId);
    }

    // 사용자가 참여한 취미 목록 조회
    @GetMapping("/user/{userId}/participated")
    public List<HobbyResponseDto> getUserParticipatedHobbies(@PathVariable String userId) {
        return hobbyService.getUserParticipatedHobbies(userId);
    }

    // 사용자가 개설한 취미 목록 조회
    @GetMapping("/user/{userId}/created")
    public List<HobbyResponseDto> getUserCreatedHobbies(@PathVariable String userId) {
        return hobbyService.getUserCreatedHobbies(userId);
    }
}
