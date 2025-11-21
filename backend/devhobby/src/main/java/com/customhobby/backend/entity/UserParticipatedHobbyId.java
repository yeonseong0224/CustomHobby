package com.customhobby.backend.entity;

import lombok.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserParticipatedHobbyId implements Serializable {
    private String userId;  // User의 PRIMARY KEY는 String
    private Long hobbyId;
}


