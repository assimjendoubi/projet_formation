package com.example.trainingplatform.dto.request;

import com.example.trainingplatform.entity.FormationLevel;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FormationRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    private String objectives;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.0", inclusive = true, message = "Le prix ne peut pas être négatif")
    private BigDecimal price;

    @NotNull(message = "La durée est obligatoire")
    @Min(value = 1, message = "La durée doit être supérieure à 0")
    private Integer durationHours;

    @NotNull(message = "Le niveau est obligatoire")
    private FormationLevel level;

    @NotNull(message = "La catégorie est obligatoire")
    private Long categoryId;
}
