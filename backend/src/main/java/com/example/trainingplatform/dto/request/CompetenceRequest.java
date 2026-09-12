package com.example.trainingplatform.dto.request;

import com.example.trainingplatform.entity.CompetenceLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompetenceRequest {

    @NotBlank(message = "Le nom de la compétence est obligatoire")
    private String name;

    private String description;

    @NotNull(message = "Le niveau est obligatoire")
    private CompetenceLevel level;
}
