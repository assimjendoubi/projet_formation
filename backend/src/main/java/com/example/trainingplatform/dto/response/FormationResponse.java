package com.example.trainingplatform.dto.response;

import com.example.trainingplatform.entity.FormationLevel;
import com.example.trainingplatform.entity.FormationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormationResponse {

    private Long id;
    private String title;
    private String description;
    private String objectives;
    private BigDecimal price;
    private Integer durationHours;
    private FormationLevel level;
    private FormationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CategorieResponse category;
    private int chapitreCount;
}
