package com.example.trainingplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfilResponse {

    private Long id;
    private String bio;
    private String address;
    private LocalDate dateOfBirth;
    private String profilePicture;
    private Long userId;
    private String userFirstName;
    private String userLastName;
    private String userEmail;
}
