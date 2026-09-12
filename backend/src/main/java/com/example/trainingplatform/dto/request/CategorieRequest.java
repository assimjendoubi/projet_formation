package com.example.trainingplatform.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategorieRequest {

    @NotBlank(message = "Le nom de la catégorie est obligatoire")
    private String name;

    private String description;
}
