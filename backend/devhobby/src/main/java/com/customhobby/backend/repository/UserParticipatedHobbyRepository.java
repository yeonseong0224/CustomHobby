package com.customhobby.backend.repository;

import com.customhobby.backend.entity.UserParticipatedHobby;
import com.customhobby.backend.entity.UserParticipatedHobbyId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserParticipatedHobbyRepository extends JpaRepository<UserParticipatedHobby, UserParticipatedHobbyId> {
    List<UserParticipatedHobby> findByUserId(String userId);;

    // 추가: 특정 사용자가 이미 특정 취미에 참여했는지 여부 확인
    boolean existsByUserIdAndHobbyId(String userId, Long hobbyId);
}
