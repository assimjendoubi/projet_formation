package com.example.trainingplatform.repository;

import com.example.trainingplatform.entity.Profil;
import com.example.trainingplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long> {

    Optional<Profil> findByUser(User user);

    Optional<Profil> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
