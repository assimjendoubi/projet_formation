package com.example.trainingplatform.controller;

import com.example.trainingplatform.dto.request.FormationRequest;
import com.example.trainingplatform.dto.response.FormationResponse;
import com.example.trainingplatform.entity.Role;
import com.example.trainingplatform.entity.User;
import com.example.trainingplatform.service.FormationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/formations")
@RequiredArgsConstructor
@Tag(name = "Formations", description = "Training catalog management")
public class FormationController {

    private final FormationService formationService;

    @GetMapping
    @Operation(summary = "Get all formations with filtering and pagination")
    public ResponseEntity<Page<FormationResponse>> getAllFormations(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication auth) {

        Role userRole = getUserRole(auth);
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(formationService.getAllFormations(title, categoryId, level, status, pageable, userRole));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get formation by ID")
    public ResponseEntity<FormationResponse> getFormationById(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(formationService.getFormationById(id, getUserRole(auth)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new formation (Admin only)")
    public ResponseEntity<FormationResponse> createFormation(@Valid @RequestBody FormationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(formationService.createFormation(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a formation (Admin only)")
    public ResponseEntity<FormationResponse> updateFormation(
            @PathVariable Long id,
            @Valid @RequestBody FormationRequest request) {
        return ResponseEntity.ok(formationService.updateFormation(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a formation (Admin only)")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long id) {
        formationService.deleteFormation(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Publish a formation (Admin only)")
    public ResponseEntity<FormationResponse> publishFormation(@PathVariable Long id) {
        return ResponseEntity.ok(formationService.publishFormation(id));
    }

    @PatchMapping("/{id}/archive")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Archive a formation (Admin only)")
    public ResponseEntity<FormationResponse> archiveFormation(@PathVariable Long id) {
        return ResponseEntity.ok(formationService.archiveFormation(id));
    }

    private Role getUserRole(Authentication auth) {
        if (auth == null) return Role.LEARNER;
        User user = (User) auth.getPrincipal();
        return user.getRole();
    }
}
