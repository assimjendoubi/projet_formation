package com.example.trainingplatform.service;

import com.example.trainingplatform.dto.request.FormationRequest;
import com.example.trainingplatform.dto.response.FormationResponse;
import com.example.trainingplatform.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FormationService {
    Page<FormationResponse> getAllFormations(String title, Long categoryId, String level,
                                             String status, Pageable pageable, Role userRole);
    FormationResponse getFormationById(Long id, Role userRole);
    FormationResponse createFormation(FormationRequest request);
    FormationResponse updateFormation(Long id, FormationRequest request);
    void deleteFormation(Long id);
    FormationResponse publishFormation(Long id);
    FormationResponse archiveFormation(Long id);
}
