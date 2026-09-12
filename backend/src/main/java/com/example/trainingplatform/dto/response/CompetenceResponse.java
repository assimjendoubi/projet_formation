package com.example.trainingplatform.dto.response;

import com.example.trainingplatform.entity.CompetenceLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompetenceResponse {

    private Long id;
    private String name;
    private String description;
    private CompetenceLevel level;
    private Long learnerId;
}
