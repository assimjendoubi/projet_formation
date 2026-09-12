package com.example.trainingplatform.service.impl;

import com.example.trainingplatform.dto.request.ChapitreRequest;
import com.example.trainingplatform.dto.response.ChapitreResponse;
import com.example.trainingplatform.entity.Chapitre;
import com.example.trainingplatform.entity.Formation;
import com.example.trainingplatform.exception.ResourceNotFoundException;
import com.example.trainingplatform.repository.ChapitreRepository;
import com.example.trainingplatform.repository.FormationRepository;
import com.example.trainingplatform.service.ChapitreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ChapitreServiceImpl implements ChapitreService {

    private final ChapitreRepository chapitreRepository;
    private final FormationRepository formationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ChapitreResponse> getChaptersByFormation(Long formationId) {
        findFormationById(formationId);
        return chapitreRepository.findByFormationIdOrderByChapterOrderAsc(formationId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ChapitreResponse getChapterById(Long id) {
        return mapToResponse(findById(id));
    }

    @Override
    public ChapitreResponse createChapter(Long formationId, ChapitreRequest request) {
        Formation formation = findFormationById(formationId);
        if (chapitreRepository.existsByFormationIdAndChapterOrder(formationId, request.getChapterOrder())) {
            throw new IllegalArgumentException(
                    "Un chapitre avec l'ordre " + request.getChapterOrder() + " existe déjà pour cette formation");
        }
        Chapitre chapitre = Chapitre.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .chapterOrder(request.getChapterOrder())
                .formation(formation)
                .build();
        return mapToResponse(chapitreRepository.save(chapitre));
    }

    @Override
    public ChapitreResponse updateChapter(Long id, ChapitreRequest request) {
        Chapitre chapitre = findById(id);
        if (!chapitre.getChapterOrder().equals(request.getChapterOrder()) &&
                chapitreRepository.existsByFormationIdAndChapterOrderAndIdNot(
                        chapitre.getFormation().getId(), request.getChapterOrder(), id)) {
            throw new IllegalArgumentException(
                    "Un chapitre avec l'ordre " + request.getChapterOrder() + " existe déjà pour cette formation");
        }
        chapitre.setTitle(request.getTitle());
        chapitre.setDescription(request.getDescription());
        chapitre.setContent(request.getContent());
        chapitre.setChapterOrder(request.getChapterOrder());
        return mapToResponse(chapitreRepository.save(chapitre));
    }

    @Override
    public void deleteChapter(Long id) {
        chapitreRepository.delete(findById(id));
    }

    @Override
    public ChapitreResponse reorderChapter(Long id, Integer newOrder) {
        Chapitre chapitre = findById(id);
        if (chapitreRepository.existsByFormationIdAndChapterOrderAndIdNot(
                chapitre.getFormation().getId(), newOrder, id)) {
            throw new IllegalArgumentException("Un chapitre avec l'ordre " + newOrder + " existe déjà");
        }
        chapitre.setChapterOrder(newOrder);
        return mapToResponse(chapitreRepository.save(chapitre));
    }

    private Chapitre findById(Long id) {
        return chapitreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapitre", "id", id));
    }

    private Formation findFormationById(Long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Formation", "id", id));
    }

    private ChapitreResponse mapToResponse(Chapitre c) {
        return ChapitreResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .content(c.getContent())
                .chapterOrder(c.getChapterOrder())
                .formationId(c.getFormation().getId())
                .formationTitle(c.getFormation().getTitle())
                .build();
    }
}
