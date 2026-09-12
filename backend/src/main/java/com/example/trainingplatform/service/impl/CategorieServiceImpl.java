package com.example.trainingplatform.service.impl;

import com.example.trainingplatform.dto.request.CategorieRequest;
import com.example.trainingplatform.dto.response.CategorieResponse;
import com.example.trainingplatform.entity.Categorie;
import com.example.trainingplatform.exception.EmailAlreadyExistsException;
import com.example.trainingplatform.exception.ResourceNotFoundException;
import com.example.trainingplatform.repository.CategorieRepository;
import com.example.trainingplatform.service.CategorieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategorieServiceImpl implements CategorieService {

    private final CategorieRepository categorieRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategorieResponse> getAllCategories() {
        return categorieRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategorieResponse getCategoryById(Long id) {
        return mapToResponse(findById(id));
    }

    @Override
    public CategorieResponse createCategory(CategorieRequest request) {
        if (categorieRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Une catégorie avec le nom '" + request.getName() + "' existe déjà");
        }
        Categorie categorie = Categorie.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return mapToResponse(categorieRepository.save(categorie));
    }

    @Override
    public CategorieResponse updateCategory(Long id, CategorieRequest request) {
        Categorie categorie = findById(id);
        if (categorieRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new IllegalArgumentException("Une catégorie avec le nom '" + request.getName() + "' existe déjà");
        }
        categorie.setName(request.getName());
        categorie.setDescription(request.getDescription());
        return mapToResponse(categorieRepository.save(categorie));
    }

    @Override
    public void deleteCategory(Long id) {
        categorieRepository.delete(findById(id));
    }

    private Categorie findById(Long id) {
        return categorieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "id", id));
    }

    private CategorieResponse mapToResponse(Categorie cat) {
        int formationCount = cat.getFormations() != null ? cat.getFormations().size() : 0;
        return CategorieResponse.builder()
                .id(cat.getId())
                .name(cat.getName())
                .description(cat.getDescription())
                .createdAt(cat.getCreatedAt())
                .formationCount(formationCount)
                .build();
    }
}
