package com.example.trainingplatform.service.impl;

import com.example.trainingplatform.dto.request.FormationRequest;
import com.example.trainingplatform.dto.response.CategorieResponse;
import com.example.trainingplatform.dto.response.FormationResponse;
import com.example.trainingplatform.entity.*;
import com.example.trainingplatform.exception.ResourceNotFoundException;
import com.example.trainingplatform.repository.CategorieRepository;
import com.example.trainingplatform.repository.FormationRepository;
import com.example.trainingplatform.service.FormationService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FormationServiceImpl implements FormationService {

    private final FormationRepository formationRepository;
    private final CategorieRepository categorieRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<FormationResponse> getAllFormations(String title, Long categoryId, String level,
                                                    String status, Pageable pageable, Role userRole) {
        boolean isAdmin = Role.ADMIN.equals(userRole);
        Specification<Formation> spec = buildSpecification(title, categoryId, level, status, isAdmin);
        return formationRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public FormationResponse getFormationById(Long id, Role userRole) {
        Formation formation = findById(id);
        if (Role.LEARNER.equals(userRole) && !FormationStatus.PUBLISHED.equals(formation.getStatus())) {
            throw new ResourceNotFoundException("Formation", "id", id);
        }
        return mapToResponse(formation);
    }

    @Override
    public FormationResponse createFormation(FormationRequest request) {
        Categorie category = findCategoryById(request.getCategoryId());
        Formation formation = Formation.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .objectives(request.getObjectives())
                .price(request.getPrice())
                .durationHours(request.getDurationHours())
                .level(request.getLevel())
                .status(FormationStatus.DRAFT)
                .category(category)
                .build();
        return mapToResponse(formationRepository.save(formation));
    }

    @Override
    public FormationResponse updateFormation(Long id, FormationRequest request) {
        Formation formation = findById(id);
        Categorie category = findCategoryById(request.getCategoryId());

        formation.setTitle(request.getTitle());
        formation.setDescription(request.getDescription());
        formation.setObjectives(request.getObjectives());
        formation.setPrice(request.getPrice());
        formation.setDurationHours(request.getDurationHours());
        formation.setLevel(request.getLevel());
        formation.setCategory(category);

        return mapToResponse(formationRepository.save(formation));
    }

    @Override
    public void deleteFormation(Long id) {
        formationRepository.delete(findById(id));
    }

    @Override
    public FormationResponse publishFormation(Long id) {
        Formation formation = findById(id);
        formation.setStatus(FormationStatus.PUBLISHED);
        return mapToResponse(formationRepository.save(formation));
    }

    @Override
    public FormationResponse archiveFormation(Long id) {
        Formation formation = findById(id);
        formation.setStatus(FormationStatus.ARCHIVED);
        return mapToResponse(formationRepository.save(formation));
    }

    private Specification<Formation> buildSpecification(String title, Long categoryId,
                                                         String level, String status, boolean isAdmin) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (title != null && !title.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (level != null && !level.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("level"), FormationLevel.valueOf(level.toUpperCase())));
                } catch (IllegalArgumentException ignored) {}
            }
            if (isAdmin && status != null && !status.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("status"), FormationStatus.valueOf(status.toUpperCase())));
                } catch (IllegalArgumentException ignored) {}
            } else if (!isAdmin) {
                predicates.add(cb.equal(root.get("status"), FormationStatus.PUBLISHED));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Formation findById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Formation", "id", id));
    }

    private Categorie findCategoryById(Long id) {
        return categorieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "id", id));
    }

    public FormationResponse mapToResponse(Formation f) {
        CategorieResponse catResponse = f.getCategory() != null ? CategorieResponse.builder()
                .id(f.getCategory().getId())
                .name(f.getCategory().getName())
                .description(f.getCategory().getDescription())
                .build() : null;

        int chapCount = f.getChapitres() != null ? f.getChapitres().size() : 0;

        return FormationResponse.builder()
                .id(f.getId())
                .title(f.getTitle())
                .description(f.getDescription())
                .objectives(f.getObjectives())
                .price(f.getPrice())
                .durationHours(f.getDurationHours())
                .level(f.getLevel())
                .status(f.getStatus())
                .createdAt(f.getCreatedAt())
                .updatedAt(f.getUpdatedAt())
                .category(catResponse)
                .chapitreCount(chapCount)
                .build();
    }
}
