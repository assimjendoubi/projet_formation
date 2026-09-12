package com.example.trainingplatform.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProfilRequest {

    private String bio;
    private String address;
    private LocalDate dateOfBirth;
    private String profilePicture;
}
