package com.example.trainingplatform.controller;

import com.example.trainingplatform.dto.request.ProfilRequest;
import com.example.trainingplatform.dto.response.ProfilResponse;
import com.example.trainingplatform.service.ProfilService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
@Tag(name = "Profiles", description = "User profile management")
public class ProfilController {

    private final ProfilService profilService;

    @GetMapping("/me")
    @Operation(summary = "Get current user's profile")
    public ResponseEntity<ProfilResponse> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(profilService.getMyProfile(auth.getName()));
    }

    @PostMapping("/me")
    @Operation(summary = "Create current user's profile")
    public ResponseEntity<ProfilResponse> createMyProfile(
            @RequestBody ProfilRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(profilService.createMyProfile(auth.getName(), request));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user's profile")
    public ResponseEntity<ProfilResponse> updateMyProfile(
            @RequestBody ProfilRequest request,
            Authentication auth) {
        return ResponseEntity.ok(profilService.updateMyProfile(auth.getName(), request));
    }

    @DeleteMapping("/me")
    @Operation(summary = "Delete current user's profile")
    public ResponseEntity<Void> deleteMyProfile(Authentication auth) {
        profilService.deleteMyProfile(auth.getName());
        return ResponseEntity.noContent().build();
    }
}
