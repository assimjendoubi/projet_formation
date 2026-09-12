package com.example.trainingplatform.service;

import com.example.trainingplatform.dto.request.UserUpdateRequest;
import com.example.trainingplatform.dto.response.DashboardStatsResponse;
import com.example.trainingplatform.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserResponse> getAllUsers(Pageable pageable);
    UserResponse getUserById(Long id);
    UserResponse updateUser(Long id, UserUpdateRequest request, String currentUserEmail);
    void deleteUser(Long id);
    UserResponse getCurrentUser(String email);
    UserResponse updateCurrentUser(String email, UserUpdateRequest request);
    DashboardStatsResponse getDashboardStats();
}
