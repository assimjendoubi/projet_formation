package com.example.trainingplatform.service.impl;

import com.example.trainingplatform.dto.request.UserCreateRequest;
import com.example.trainingplatform.dto.request.UserUpdateRequest;
import com.example.trainingplatform.dto.response.DashboardStatsResponse;
import com.example.trainingplatform.dto.response.UserResponse;
import com.example.trainingplatform.entity.FormationStatus;
import com.example.trainingplatform.entity.Role;
import com.example.trainingplatform.entity.User;
import com.example.trainingplatform.exception.EmailAlreadyExistsException;
import com.example.trainingplatform.exception.ResourceNotFoundException;
import com.example.trainingplatform.repository.CategorieRepository;
import com.example.trainingplatform.repository.FormationRepository;
import com.example.trainingplatform.repository.UserRepository;
import com.example.trainingplatform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FormationRepository formationRepository;
    private final CategorieRepository categorieRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = findUserById(id);
        return mapToResponse(user);
    }

    @Override
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.LEARNER)
                .phone(request.getPhone())
                .enabled(request.getEnabled() != null ? request.getEnabled() : true)
                .build();

        return mapToResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUser(Long id, UserUpdateRequest request, String currentUserEmail) {
        User user = findUserById(id);
        applyUpdates(user, request, true);
        return mapToResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        User user = findUserById(id);
        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = findUserByEmail(email);
        return mapToResponse(user);
    }

    @Override
    public UserResponse updateCurrentUser(String email, UserUpdateRequest request) {
        User user = findUserByEmail(email);
        applyUpdates(user, request, false);
        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        return DashboardStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalLearners(userRepository.countByRole(Role.LEARNER))
                .totalFormations(formationRepository.count())
                .totalCategories(categorieRepository.count())
                .publishedFormations(formationRepository.countByStatus(FormationStatus.PUBLISHED))
                .draftFormations(formationRepository.countByStatus(FormationStatus.DRAFT))
                .archivedFormations(formationRepository.countByStatus(FormationStatus.ARCHIVED))
                .build();
    }

    private void applyUpdates(User user, UserUpdateRequest request, boolean isAdmin) {
        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (isAdmin) {
            if (request.getEnabled() != null) {
                user.setEnabled(request.getEnabled());
            }
            if (request.getRole() != null) {
                user.setRole(request.getRole());
            }
        }
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "id", id));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));
    }

    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
