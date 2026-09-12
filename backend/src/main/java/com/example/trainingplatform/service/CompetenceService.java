package com.example.trainingplatform.service;

import com.example.trainingplatform.dto.request.CompetenceRequest;
import com.example.trainingplatform.dto.response.CompetenceResponse;

import java.util.List;

public interface CompetenceService {
    List<CompetenceResponse> getMyCompetences(String email);
    CompetenceResponse addCompetence(String email, CompetenceRequest request);
    CompetenceResponse updateCompetence(Long id, String email, CompetenceRequest request);
    void deleteCompetence(Long id, String email);
}
