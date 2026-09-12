package com.example.trainingplatform.controller;

import com.example.trainingplatform.dto.request.ChapitreRequest;
import com.example.trainingplatform.dto.response.ChapitreResponse;
import com.example.trainingplatform.service.ChapitreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Chapters", description = "Formation chapter management")
public class ChapitreController {

    private final ChapitreService chapitreService;

    @GetMapping("/api/formations/{formationId}/chapters")
    @Operation(summary = "Get chapters for a formation (ordered)")
    public ResponseEntity<List<ChapitreResponse>> getChaptersByFormation(
            @PathVariable Long formationId) {
        return ResponseEntity.ok(chapitreService.getChaptersByFormation(formationId));
    }

    @GetMapping("/api/chapters/{id}")
    @Operation(summary = "Get chapter by ID")
    public ResponseEntity<ChapitreResponse> getChapterById(@PathVariable Long id) {
        return ResponseEntity.ok(chapitreService.getChapterById(id));
    }

    @PostMapping("/api/formations/{formationId}/chapters")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a chapter (Admin only)")
    public ResponseEntity<ChapitreResponse> createChapter(
            @PathVariable Long formationId,
            @Valid @RequestBody ChapitreRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chapitreService.createChapter(formationId, request));
    }

    @PutMapping("/api/chapters/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a chapter (Admin only)")
    public ResponseEntity<ChapitreResponse> updateChapter(
            @PathVariable Long id,
            @Valid @RequestBody ChapitreRequest request) {
        return ResponseEntity.ok(chapitreService.updateChapter(id, request));
    }

    @DeleteMapping("/api/chapters/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a chapter (Admin only)")
    public ResponseEntity<Void> deleteChapter(@PathVariable Long id) {
        chapitreService.deleteChapter(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/api/chapters/{id}/reorder")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reorder a chapter (Admin only)")
    public ResponseEntity<ChapitreResponse> reorderChapter(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        Integer newOrder = body.get("chapterOrder");
        if (newOrder == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(chapitreService.reorderChapter(id, newOrder));
    }
}
