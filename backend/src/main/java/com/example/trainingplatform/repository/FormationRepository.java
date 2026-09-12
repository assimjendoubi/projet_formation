package com.example.trainingplatform.repository;

import com.example.trainingplatform.entity.Formation;
import com.example.trainingplatform.entity.FormationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long>,
        JpaSpecificationExecutor<Formation> {

    long countByStatus(FormationStatus status);

    Page<Formation> findByStatus(FormationStatus status, Pageable pageable);
}
