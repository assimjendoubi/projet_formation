package com.example.trainingplatform.repository;

import com.example.trainingplatform.entity.Chapitre;
import com.example.trainingplatform.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapitreRepository extends JpaRepository<Chapitre, Long> {

    List<Chapitre> findByFormationOrderByChapterOrderAsc(Formation formation);

    List<Chapitre> findByFormationIdOrderByChapterOrderAsc(Long formationId);

    boolean existsByFormationIdAndChapterOrder(Long formationId, Integer chapterOrder);

    boolean existsByFormationIdAndChapterOrderAndIdNot(Long formationId, Integer chapterOrder, Long id);
}
