package com.example.trainingplatform.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Builder
@Entity
@Table(name = "formations")
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String objectives;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer durationHours;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FormationLevel level;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private FormationStatus status = FormationStatus.DRAFT;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Categorie category;

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @OrderBy("chapterOrder ASC")
    private List<Chapitre> chapitres;

    public Formation(Long id, String title, String description, String objectives,
                     BigDecimal price, Integer durationHours, FormationLevel level,
                     FormationStatus status, LocalDateTime createdAt, LocalDateTime updatedAt,
                     Categorie category, List<Chapitre> chapitres) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.objectives = objectives;
        this.price = price;
        this.durationHours = durationHours;
        this.level = level;
        this.status = status != null ? status : FormationStatus.DRAFT;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.category = category;
        this.chapitres = chapitres;
    }
}
