package com.example.trainingplatform.controller;

import com.example.trainingplatform.dto.request.CompetenceRequest;
import com.example.trainingplatform.dto.response.CompetenceResponse;
import com.example.trainingplatform.service.CompetenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/competencies")
@RequiredArgsConstructor
@Tag(name = "Competencies", description = "Learner competency management")
public class CompetenceController {

    private final CompetenceService competenceService;

    @GetMapping("/me")
    @Operation(summary = "Get current user's competencies")
    public ResponseEntity<List<CompetenceResponse>> getMyCompetences(Authentication auth) {
        return ResponseEntity.ok(competenceService.getMyCompetences(auth.getName()));
    }

    @PostMapping
    @Operation(summary = "Add a competency for current user")
    public ResponseEntity<CompetenceResponse> addCompetence(
            @Valid @RequestBody CompetenceRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(competenceService.addCompetence(auth.getName(), request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a competency")
    public ResponseEntity<CompetenceResponse> updateCompetence(
            @PathVariable Long id,
            @Valid @RequestBody CompetenceRequest request,
            Authentication auth) {
        return ResponseEntity.ok(competenceService.updateCompetence(id, auth.getName(), request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a competency")
    public ResponseEntity<Void> deleteCompetence(@PathVariable Long id, Authentication auth) {
        competenceService.deleteCompetence(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
