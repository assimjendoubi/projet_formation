package com.example.trainingplatform.service;

import com.example.trainingplatform.dto.request.ProfilRequest;
import com.example.trainingplatform.dto.response.ProfilResponse;

public interface ProfilService {
    ProfilResponse getMyProfile(String email);
    ProfilResponse createMyProfile(String email, ProfilRequest request);
    ProfilResponse updateMyProfile(String email, ProfilRequest request);
    void deleteMyProfile(String email);
}
