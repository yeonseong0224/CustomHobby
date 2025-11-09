package com.customhobby.backend.repository;

import com.customhobby.backend.domain.Hobby;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HobbyRepository extends JpaRepository<Hobby, Long> {
    List<Hobby> findByHobbyCategory(String hobbyCategory);
    List<Hobby> findByCreatorId(String creatorId);  // ✅ String creatorId
}


