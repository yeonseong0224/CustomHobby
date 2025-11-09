package com.customhobby.backend.controller;

import com.customhobby.backend.dto.HobbyGroupRequestDto;
import com.customhobby.backend.dto.HobbyGroupResponseDto;
import com.customhobby.backend.service.HobbyGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/hobby-groups")
@RequiredArgsConstructor
public class HobbyGroupController {

    private final HobbyGroupService hobbyGroupService;

    // 모임 개설
    @PostMapping
    public HobbyGroupResponseDto createGroup(@RequestBody HobbyGroupRequestDto request) {
        return hobbyGroupService.createGroup(request);
    }

    // 모든 모임 조회
    @GetMapping
    public List<HobbyGroupResponseDto> getAllGroups() {
        return hobbyGroupService.getAllGroups();
    }

    // 모임 상세 조회
    @GetMapping("/{id}")
    public HobbyGroupResponseDto getGroup(@PathVariable Long id) {
        return hobbyGroupService.getGroup(id);
    }

    // 모임 참여
    @PostMapping("/{groupId}/participate")
    public void participateGroup(@PathVariable Long groupId, @RequestParam String userId) {  // ✅ String userId
        hobbyGroupService.participateGroup(userId, groupId);
    }

    // 사용자가 참여한 모임 목록 조회
    @GetMapping("/user/{userId}/participated")
    public List<HobbyGroupResponseDto> getUserParticipatedGroups(@PathVariable String userId) {  // ✅ String userId
        return hobbyGroupService.getUserParticipatedGroups(userId);
    }

    // 사용자가 개설한 모임 목록 조회
    @GetMapping("/user/{userId}/created")
    public List<HobbyGroupResponseDto> getUserCreatedGroups(@PathVariable String userId) {  // ✅ String userId
        return hobbyGroupService.getUserCreatedGroups(userId);
    }
}


