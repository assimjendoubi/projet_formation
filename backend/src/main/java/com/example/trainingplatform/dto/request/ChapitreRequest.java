package com.example.trainingplatform.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChapitreRequest {

    @NotBlank(message = "Le titre du chapitre est obligatoire")
    private String title;

    private String description;
    private String content;

    @NotNull(message = "L'ordre du chapitre est obligatoire")
    @Min(value = 1, message = "L'ordre doit être supérieur à 0")
    private Integer chapterOrder;
}
