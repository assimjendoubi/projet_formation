package com.example.trainingplatform.service;

import com.example.trainingplatform.dto.request.CategorieRequest;
import com.example.trainingplatform.dto.response.CategorieResponse;

import java.util.List;

public interface CategorieService {
    List<CategorieResponse> getAllCategories();
    CategorieResponse getCategoryById(Long id);
    CategorieResponse createCategory(CategorieRequest request);
    CategorieResponse updateCategory(Long id, CategorieRequest request);
    void deleteCategory(Long id);
}
