package com.customhobby.backend.repository;

import com.customhobby.backend.domain.UserParticipatedHobby;
import com.customhobby.backend.domain.UserParticipatedHobbyId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserParticipatedHobbyRepository extends JpaRepository<UserParticipatedHobby, UserParticipatedHobbyId> {
    List<UserParticipatedHobby> findByUserId(String userId);  // ✅ String userId
    List<UserParticipatedHobby> findByHobbyId(Long hobbyId);
}


