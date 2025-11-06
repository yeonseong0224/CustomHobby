package com.customhobby.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_participated_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(UserParticipatedGroupId.class)
public class UserParticipatedGroup {

    @Id
    @Column(name = "user_id", nullable = false, length = 30)
    private String userId;  // ✅ User의 PRIMARY KEY는 String

    @Id
    @Column(name = "group_id", nullable = false)
    private Long groupId;
}


