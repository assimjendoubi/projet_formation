package com.example.trainingplatform.init;

import com.example.trainingplatform.entity.*;
import com.example.trainingplatform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final ProfilRepository profilRepository;
    private final CompetenceRepository competenceRepository;
    private final CategorieRepository categorieRepository;
    private final FormationRepository formationRepository;
    private final ChapitreRepository chapitreRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initialization.");
            return;
        }

        log.info("Seeding database with initial data...");

        // ===== ADMIN =====
        User admin = userRepository.save(User.builder()
                .firstName("Admin")
                .lastName("Platform")
                .email("admin@training.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .phone("0600000000")
                .build());

        // ===== LEARNERS =====
        User alice = userRepository.save(User.builder()
                .firstName("Alice")
                .lastName("Dupont")
                .email("alice@training.com")
                .password(passwordEncoder.encode("Learner@123"))
                .role(Role.LEARNER)
                .phone("0611111111")
                .build());

        User bob = userRepository.save(User.builder()
                .firstName("Bob")
                .lastName("Martin")
                .email("bob@training.com")
                .password(passwordEncoder.encode("Learner@123"))
                .role(Role.LEARNER)
                .phone("0622222222")
                .build());

        User charlie = userRepository.save(User.builder()
                .firstName("Charlie")
                .lastName("Bernard")
                .email("charlie@training.com")
                .password(passwordEncoder.encode("Learner@123"))
                .role(Role.LEARNER)
                .phone("0633333333")
                .build());

        // ===== PROFILES =====
        profilRepository.save(Profil.builder()
                .bio("Développeuse web passionnée par les nouvelles technologies.")
                .address("Paris, France")
                .dateOfBirth(LocalDate.of(1995, 5, 15))
                .user(alice)
                .build());

        profilRepository.save(Profil.builder()
                .bio("Ingénieur logiciel spécialisé en backend Java.")
                .address("Lyon, France")
                .dateOfBirth(LocalDate.of(1992, 8, 22))
                .user(bob)
                .build());

        // ===== COMPETENCES =====
        competenceRepository.save(Competence.builder()
                .name("Java")
                .description("Programmation orientée objet avec Java")
                .level(CompetenceLevel.INTERMEDIATE)
                .learner(alice)
                .build());
        competenceRepository.save(Competence.builder()
                .name("Angular")
                .description("Développement frontend avec Angular")
                .level(CompetenceLevel.BEGINNER)
                .learner(alice)
                .build());
        competenceRepository.save(Competence.builder()
                .name("Spring Boot")
                .description("API REST avec Spring Boot")
                .level(CompetenceLevel.ADVANCED)
                .learner(bob)
                .build());
        competenceRepository.save(Competence.builder()
                .name("SQL")
                .description("Bases de données relationnelles")
                .level(CompetenceLevel.INTERMEDIATE)
                .learner(bob)
                .build());
        competenceRepository.save(Competence.builder()
                .name("Python")
                .description("Scripting et data science")
                .level(CompetenceLevel.BEGINNER)
                .learner(charlie)
                .build());

        // ===== CATEGORIES =====
        Categorie programming = categorieRepository.save(Categorie.builder()
                .name("Programmation")
                .description("Développement logiciel, langages et frameworks")
                .build());

        Categorie design = categorieRepository.save(Categorie.builder()
                .name("Design & UX")
                .description("Conception graphique et expérience utilisateur")
                .build());

        Categorie management = categorieRepository.save(Categorie.builder()
                .name("Management")
                .description("Gestion de projet et leadership")
                .build());

        // ===== FORMATIONS =====
        Formation javaFormation = formationRepository.save(Formation.builder()
                .title("Java pour débutants")
                .description("Apprenez les fondamentaux du langage Java et de la POO.")
                .objectives("Maîtriser la syntaxe Java, la POO, les collections et les exceptions.")
                .price(BigDecimal.valueOf(99.99))
                .durationHours(20)
                .level(FormationLevel.BEGINNER)
                .status(FormationStatus.PUBLISHED)
                .category(programming)
                .build());

        Formation springFormation = formationRepository.save(Formation.builder()
                .title("Spring Boot & REST API")
                .description("Développez des API REST professionnelles avec Spring Boot 3.")
                .objectives("Créer une API REST sécurisée avec JWT, JPA et Swagger.")
                .price(BigDecimal.valueOf(149.99))
                .durationHours(30)
                .level(FormationLevel.INTERMEDIATE)
                .status(FormationStatus.PUBLISHED)
                .category(programming)
                .build());

        Formation angularFormation = formationRepository.save(Formation.builder()
                .title("Angular Avancé")
                .description("Maîtrisez Angular avec RxJS, NgRx et les tests unitaires.")
                .objectives("Construire des SPA complexes avec Angular standalone components.")
                .price(BigDecimal.valueOf(179.99))
                .durationHours(40)
                .level(FormationLevel.ADVANCED)
                .status(FormationStatus.PUBLISHED)
                .category(programming)
                .build());

        Formation uxFormation = formationRepository.save(Formation.builder()
                .title("UX Design Fondamentaux")
                .description("Découvrez les principes du design centré utilisateur.")
                .objectives("Créer des wireframes, prototypes et mener des tests utilisateurs.")
                .price(BigDecimal.valueOf(89.99))
                .durationHours(15)
                .level(FormationLevel.BEGINNER)
                .status(FormationStatus.PUBLISHED)
                .category(design)
                .build());

        Formation projectFormation = formationRepository.save(Formation.builder()
                .title("Gestion de Projet Agile")
                .description("Apprenez à gérer des projets en méthode Scrum et Kanban.")
                .objectives("Animer des sprints, gérer un backlog et livrer de la valeur.")
                .price(BigDecimal.valueOf(129.99))
                .durationHours(25)
                .level(FormationLevel.INTERMEDIATE)
                .status(FormationStatus.DRAFT)
                .category(management)
                .build());

        // ===== CHAPTERS =====
        // Java formation chapters
        chapitreRepository.save(Chapitre.builder().title("Introduction à Java").description("Historique et installation")
                .content("Java est un langage orienté objet créé par Sun Microsystems en 1995. Dans ce chapitre, nous allons installer le JDK et configurer notre environnement de développement.")
                .chapterOrder(1).formation(javaFormation).build());
        chapitreRepository.save(Chapitre.builder().title("Variables et types de données")
                .description("Primitifs et objets").content("En Java, les types primitifs incluent int, double, boolean, char, etc. Les types référence sont des objets créés à partir de classes.")
                .chapterOrder(2).formation(javaFormation).build());
        chapitreRepository.save(Chapitre.builder().title("Programmation Orientée Objet")
                .description("Classes, objets et héritage").content("La POO repose sur 4 piliers : encapsulation, héritage, polymorphisme et abstraction.")
                .chapterOrder(3).formation(javaFormation).build());

        // Spring formation chapters
        chapitreRepository.save(Chapitre.builder().title("Introduction à Spring Boot")
                .description("Architecture et configuration").content("Spring Boot simplifie la création d'applications Spring avec une configuration automatique et un serveur embarqué.")
                .chapterOrder(1).formation(springFormation).build());
        chapitreRepository.save(Chapitre.builder().title("REST Controllers et DTOs")
                .description("Conception d'API REST").content("Les contrôleurs REST gèrent les requêtes HTTP. Les DTOs permettent de contrôler les données exposées dans l'API.")
                .chapterOrder(2).formation(springFormation).build());
        chapitreRepository.save(Chapitre.builder().title("Spring Security & JWT")
                .description("Sécurisation de l'API").content("Spring Security protège les endpoints. JWT permet l'authentification stateless sans sessions serveur.")
                .chapterOrder(3).formation(springFormation).build());

        // Angular formation chapters
        chapitreRepository.save(Chapitre.builder().title("Composants Standalone Angular 17")
                .description("Architecture moderne").content("Angular 17 adopte les composants standalone par défaut, éliminant le besoin de NgModule pour les cas simples.")
                .chapterOrder(1).formation(angularFormation).build());
        chapitreRepository.save(Chapitre.builder().title("Reactive Forms et Validation")
                .description("Formulaires réactifs").content("Les Reactive Forms offrent un contrôle granulaire sur la validation et l'état des formulaires.")
                .chapterOrder(2).formation(angularFormation).build());

        // UX formation chapters
        chapitreRepository.save(Chapitre.builder().title("Principes du Design Centré Utilisateur")
                .description("Introduction à l'UX").content("Le design centré utilisateur place l'utilisateur au cœur du processus de conception.")
                .chapterOrder(1).formation(uxFormation).build());
        chapitreRepository.save(Chapitre.builder().title("Wireframes et Prototypes")
                .description("Outils de conception").content("Les wireframes sont des maquettes basse fidélité. Les prototypes haute fidélité simulent l'interface finale.")
                .chapterOrder(2).formation(uxFormation).build());

        // Project management chapters
        chapitreRepository.save(Chapitre.builder().title("Introduction à Scrum")
                .description("Cadre Agile Scrum").content("Scrum est un cadre agile basé sur des sprints de 2 à 4 semaines avec des rituels quotidiens.")
                .chapterOrder(1).formation(projectFormation).build());
        chapitreRepository.save(Chapitre.builder().title("Gestion du Backlog")
                .description("Priorisation et estimation").content("Le backlog produit contient toutes les user stories priorisées par valeur métier.")
                .chapterOrder(2).formation(projectFormation).build());

        log.info("✅ Database seeded successfully!");
        log.info("  Admin: admin@training.com / Admin@123");
        log.info("  Learners: alice@training.com, bob@training.com, charlie@training.com / Learner@123");
    }
}
