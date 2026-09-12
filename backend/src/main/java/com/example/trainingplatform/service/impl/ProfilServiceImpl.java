package com.example.trainingplatform.service.impl;

import com.example.trainingplatform.dto.request.ProfilRequest;
import com.example.trainingplatform.dto.response.ProfilResponse;
import com.example.trainingplatform.entity.Profil;
import com.example.trainingplatform.entity.User;
import com.example.trainingplatform.exception.ResourceNotFoundException;
import com.example.trainingplatform.repository.ProfilRepository;
import com.example.trainingplatform.repository.UserRepository;
import com.example.trainingplatform.service.ProfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfilServiceImpl implements ProfilService {

    private final ProfilRepository profilRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public ProfilResponse getMyProfile(String email) {
        User user = findUserByEmail(email);
        Profil profil = profilRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé pour cet utilisateur"));
        return mapToResponse(profil);
    }

    @Override
    public ProfilResponse createMyProfile(String email, ProfilRequest request) {
        User user = findUserByEmail(email);
        if (profilRepository.existsByUserId(user.getId())) {
            // If profile exists, update instead
            return updateMyProfile(email, request);
        }
        Profil profil = Profil.builder()
                .bio(request.getBio())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .profilePicture(request.getProfilePicture())
                .user(user)
                .build();
        return mapToResponse(profilRepository.save(profil));
    }

    @Override
    public ProfilResponse updateMyProfile(String email, ProfilRequest request) {
        User user = findUserByEmail(email);
        Profil profil = profilRepository.findByUser(user)
                .orElseGet(() -> Profil.builder().user(user).build());

        if (request.getBio() != null) profil.setBio(request.getBio());
        if (request.getAddress() != null) profil.setAddress(request.getAddress());
        if (request.getDateOfBirth() != null) profil.setDateOfBirth(request.getDateOfBirth());
        if (request.getProfilePicture() != null) profil.setProfilePicture(request.getProfilePicture());

        return mapToResponse(profilRepository.save(profil));
    }

    @Override
    public void deleteMyProfile(String email) {
        User user = findUserByEmail(email);
        Profil profil = profilRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé"));
        profilRepository.delete(profil);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));
    }

    private ProfilResponse mapToResponse(Profil profil) {
        return ProfilResponse.builder()
                .id(profil.getId())
                .bio(profil.getBio())
                .address(profil.getAddress())
                .dateOfBirth(profil.getDateOfBirth())
                .profilePicture(profil.getProfilePicture())
                .userId(profil.getUser().getId())
                .userFirstName(profil.getUser().getFirstName())
                .userLastName(profil.getUser().getLastName())
                .userEmail(profil.getUser().getEmail())
                .build();
    }
}
