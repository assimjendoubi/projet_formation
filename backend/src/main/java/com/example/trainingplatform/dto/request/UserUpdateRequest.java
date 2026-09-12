package com.example.trainingplatform.dto.request;

import com.example.trainingplatform.entity.Role;
import lombok.Data;

@Data
public class UserUpdateRequest {

    private String firstName;
    private String lastName;
    private String phone;

    // Admin-only fields
    private Boolean enabled;
    private Role role;
}
