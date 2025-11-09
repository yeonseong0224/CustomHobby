package com.customhobby.backend.repository;

import com.customhobby.backend.domain.HobbyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HobbyGroupRepository extends JpaRepository<HobbyGroup, Long> {
    List<HobbyGroup> findByCreatorId(String creatorId);  // ✅ String creatorId
}


