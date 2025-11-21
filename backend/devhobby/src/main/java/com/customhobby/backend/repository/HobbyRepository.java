package com.customhobby.backend.repository;

import com.customhobby.backend.entity.Hobby;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HobbyRepository extends JpaRepository<Hobby, Long> {

    // 카테고리별 취미 조회
    List<Hobby> findByHobbyCategory(String hobbyCategory);

    // 개설자 ID로 취미 조회
    List<Hobby> findByCreatorId(String creatorId);

    // 취미 이름으로 조회 (여러 개 허용)
    List<Hobby> findByHobbyName(String hobbyName);
}
