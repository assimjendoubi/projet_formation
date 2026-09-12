package com.example.trainingplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private long totalUsers;
    private long totalLearners;
    private long totalFormations;
    private long totalCategories;
    private long publishedFormations;
    private long draftFormations;
    private long archivedFormations;
}
