package com.example.trainingplatform.service;

import com.example.trainingplatform.dto.request.LoginRequest;
import com.example.trainingplatform.dto.request.RegisterRequest;
import com.example.trainingplatform.dto.response.AuthResponse;
import com.example.trainingplatform.dto.response.UserResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getCurrentUser(String email);
}
