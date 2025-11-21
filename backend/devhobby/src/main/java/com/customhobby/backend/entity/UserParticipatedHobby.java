package com.customhobby.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_participated_hobbies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(UserParticipatedHobbyId.class)
public class UserParticipatedHobby {

    @Id
    @Column(name = "user_id", nullable = false, length = 30)
    private String userId;  // User의 PRIMARY KEY는 String

    @Id
    @Column(name = "hobby_id", nullable = false)
    private Long hobbyId;
}


