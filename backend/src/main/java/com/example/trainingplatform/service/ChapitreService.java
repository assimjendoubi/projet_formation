package com.example.trainingplatform.service;

import com.example.trainingplatform.dto.request.ChapitreRequest;
import com.example.trainingplatform.dto.response.ChapitreResponse;

import java.util.List;

public interface ChapitreService {
    List<ChapitreResponse> getChaptersByFormation(Long formationId);
    ChapitreResponse getChapterById(Long id);
    ChapitreResponse createChapter(Long formationId, ChapitreRequest request);
    ChapitreResponse updateChapter(Long id, ChapitreRequest request);
    void deleteChapter(Long id);
    ChapitreResponse reorderChapter(Long id, Integer newOrder);
}
