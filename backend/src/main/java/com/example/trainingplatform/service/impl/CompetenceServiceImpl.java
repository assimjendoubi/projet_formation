package com.example.trainingplatform.service.impl;

import com.example.trainingplatform.dto.request.CompetenceRequest;
import com.example.trainingplatform.dto.response.CompetenceResponse;
import com.example.trainingplatform.entity.Competence;
import com.example.trainingplatform.entity.User;
import com.example.trainingplatform.exception.ResourceNotFoundException;
import com.example.trainingplatform.exception.UnauthorizedException;
import com.example.trainingplatform.repository.CompetenceRepository;
import com.example.trainingplatform.repository.UserRepository;
import com.example.trainingplatform.service.CompetenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CompetenceServiceImpl implements CompetenceService {

    private final CompetenceRepository competenceRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CompetenceResponse> getMyCompetences(String email) {
        User user = findUserByEmail(email);
        return competenceRepository.findByLearner(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CompetenceResponse addCompetence(String email, CompetenceRequest request) {
        User user = findUserByEmail(email);
        Competence competence = Competence.builder()
                .name(request.getName())
                .description(request.getDescription())
                .level(request.getLevel())
                .learner(user)
                .build();
        return mapToResponse(competenceRepository.save(competence));
    }

    @Override
    public CompetenceResponse updateCompetence(Long id, String email, CompetenceRequest request) {
        User user = findUserByEmail(email);
        Competence competence = competenceRepository.findByIdAndLearnerId(id, user.getId())
                .orElseThrow(() -> new UnauthorizedException("Compétence non trouvée ou accès non autorisé"));

        competence.setName(request.getName());
        competence.setDescription(request.getDescription());
        competence.setLevel(request.getLevel());

        return mapToResponse(competenceRepository.save(competence));
    }

    @Override
    public void deleteCompetence(Long id, String email) {
        User user = findUserByEmail(email);
        Competence competence = competenceRepository.findByIdAndLearnerId(id, user.getId())
                .orElseThrow(() -> new UnauthorizedException("Compétence non trouvée ou accès non autorisé"));
        competenceRepository.delete(competence);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));
    }

    private CompetenceResponse mapToResponse(Competence competence) {
        return CompetenceResponse.builder()
                .id(competence.getId())
                .name(competence.getName())
                .description(competence.getDescription())
                .level(competence.getLevel())
                .learnerId(competence.getLearner().getId())
                .build();
    }
}
