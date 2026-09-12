package com.example.trainingplatform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapitreResponse {

    private Long id;
    private String title;
    private String description;
    private String content;
    private Integer chapterOrder;
    private Long formationId;
    private String formationTitle;
}
