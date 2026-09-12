package com.example.trainingplatform.repository;

import com.example.trainingplatform.entity.Competence;
import com.example.trainingplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompetenceRepository extends JpaRepository<Competence, Long> {

    List<Competence> findByLearner(User learner);

    List<Competence> findByLearnerId(Long learnerId);

    Optional<Competence> findByIdAndLearnerId(Long id, Long learnerId);
}
