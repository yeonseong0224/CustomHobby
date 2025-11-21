package com.customhobby.backend.repository;

import com.customhobby.backend.entity.UserParticipatedGroup;
import com.customhobby.backend.entity.UserParticipatedGroupId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserParticipatedGroupRepository extends JpaRepository<UserParticipatedGroup, UserParticipatedGroupId> {
    List<UserParticipatedGroup> findByUserId(String userId);  // String userId
}


