import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { CompetenceService } from '../../../core/services/competence.service';
import { ProfilService } from '../../../core/services/profil.service';
import { FormationService } from '../../../core/services/formation.service';
import { User, Competence, Profil, Formation } from '../../../core/models/models';

@Component({
  selector: 'app-learner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <div class="main-content">
        <div class="page-content">
          <div class="page-header">
            <div class="welcome-banner">
              <div class="welcome-text">
                <span class="greeting">Bonjour,</span>
                <h1>{{ fullName() }} 👋</h1>
                <p>Continuez votre parcours d'apprentissage</p>
              </div>
              <div class="welcome-avatar">{{ initials() }}</div>
            </div>
          </div>

          <!-- Profile Completion -->
          @if (profil) {
            <div class="card mb-6" style="padding: 20px 24px;">
              <div class="flex items-center justify-between mb-2">
                <h4>Complétude du profil</h4>
                <span class="badge badge-primary">{{ completionPercent }}%</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar" [style.width.%]="completionPercent"></div>
              </div>
              <p class="text-sm text-muted mt-2">
                @if (completionPercent < 100) { Complétez votre profil pour une meilleure expérience. <a routerLink="/profile">→ Mon profil</a> }
                @else { Votre profil est complet ! 🎉 }
              </p>
            </div>
          }

          <!-- Quick Stats -->
          <div class="stats-grid mb-6" style="grid-template-columns: repeat(3, 1fr);">
            <div class="stat-card stat-card-purple">
              <div class="stat-icon">🏆</div>
              <div class="stat-value">{{ competences.length }}</div>
              <div class="stat-label">Compétences</div>
            </div>
            <div class="stat-card stat-card-cyan">
              <div class="stat-icon">📚</div>
              <div class="stat-value">{{ totalFormations }}</div>
              <div class="stat-label">Formations disponibles</div>
            </div>
            <div class="stat-card stat-card-green">
              <div class="stat-icon">✅</div>
              <div class="stat-value">{{ completionPercent }}%</div>
              <div class="stat-label">Profil complété</div>
            </div>
          </div>

          <div class="dashboard-grid">
            <!-- Competencies -->
            <div class="card">
              <div class="card-header">
                <div class="flex items-center justify-between">
                  <h3>Mes Compétences</h3>
                  <a routerLink="/profile" class="btn btn-sm btn-secondary">Gérer</a>
                </div>
              </div>
              <div class="card-body">
                @if (competences.length === 0) {
                  <div class="empty-state" style="padding: 24px;">
                    <div class="empty-icon">🎯</div>
                    <p>Ajoutez vos compétences dans votre profil</p>
                  </div>
                } @else {
                  <div class="competence-chips">
                    @for (comp of competences; track comp.id) {
                      <span class="competence-chip">
                        <span>{{ comp.name }}</span>
                        <span class="badge badge-{{ getLevelColor(comp.level) }}" style="font-size: 0.65rem; padding: 2px 6px;">{{ comp.level }}</span>
                      </span>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="card">
              <div class="card-header"><h3>Accès Rapides</h3></div>
              <div class="card-body">
                <div class="quick-actions">
                  <a routerLink="/catalog" class="quick-action-btn">
                    <span class="qa-icon">📚</span>
                    <div>
                      <div class="qa-title">Catalogue</div>
                      <div class="qa-desc">Explorer les formations</div>
                    </div>
                  </a>
                  <a routerLink="/profile" class="quick-action-btn">
                    <span class="qa-icon">👤</span>
                    <div>
                      <div class="qa-title">Mon Profil</div>
                      <div class="qa-desc">Gérer mes informations</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Latest Formations -->
          <div class="mt-6">
            <div class="flex items-center justify-between mb-4">
              <h2>Formations Récentes</h2>
              <a routerLink="/catalog" class="btn btn-secondary btn-sm">Voir tout →</a>
            </div>
            @if (loading) {
              <div class="loading-container"><div class="spinner"></div></div>
            } @else {
              <div class="formations-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
                @for (f of recentFormations; track f.id) {
                  <a [routerLink]="['/formations', f.id]" class="formation-card" style="text-decoration: none;">
                    <div class="formation-card-header">
                      <div class="flex items-center justify-between mb-2">
                        <span class="badge badge-primary">{{ f.category?.name }}</span>
                        <span class="badge badge-{{ getLevelBadge(f.level) }}">{{ f.level }}</span>
                      </div>
                      <h4 class="formation-title">{{ f.title }}</h4>
                    </div>
                    <div class="formation-card-body">
                      <p class="formation-description">{{ f.description }}</p>
                    </div>
                    <div class="formation-card-footer">
                      <span class="formation-meta">⏱ {{ f.durationHours }}h · 📖 {{ f.chapitreCount }} chapitres</span>
                      <span class="formation-price">{{ f.price }}€</span>
                    </div>
                  </a>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-banner { display: flex; align-items: center; justify-content: space-between; padding: 28px 32px; background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1)); border: 1px solid rgba(99,102,241,0.25); border-radius: 20px; margin-bottom: 28px; }
    .greeting { font-size: 0.9rem; color: var(--primary-light); font-weight: 500; }
    .welcome-text h1 { font-size: 2rem; margin: 4px 0 8px; }
    .welcome-text p { color: var(--text-secondary); }
    .welcome-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: white; flex-shrink: 0; }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .quick-actions { display: flex; flex-direction: column; gap: 10px; }
    .quick-action-btn { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); color: var(--text-primary); text-decoration: none; transition: var(--transition); }
    .quick-action-btn:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); }
    .qa-icon { font-size: 1.5rem; }
    .qa-title { font-weight: 600; font-size: 0.9rem; }
    .qa-desc { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
    @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } .welcome-banner { flex-direction: column; text-align: center; gap: 16px; } }
  `]
})
export class LearnerDashboardComponent implements OnInit {
  competences: Competence[] = [];
  profil: Profil | null = null;
  recentFormations: Formation[] = [];
  totalFormations = 0;
  loading = false;
  completionPercent = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private competenceService: CompetenceService,
    private profilService: ProfilService,
    private formationService: FormationService
  ) {}

  fullName = computed(() => {
    const u = this.authService.currentUser();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });
  initials = computed(() => {
    const u = this.authService.currentUser();
    return u ? (u.firstName[0] + u.lastName[0]).toUpperCase() : '';
  });

  ngOnInit() {
    this.loadCompetences();
    this.loadProfile();
    this.loadFormations();
  }

  loadCompetences() {
    this.competenceService.getMyCompetences().subscribe({ next: c => this.competences = c, error: () => {} });
  }

  loadProfile() {
    this.profilService.getMyProfile().subscribe({
      next: p => { this.profil = p; this.calcCompletion(p); },
      error: () => this.completionPercent = 20
    });
  }

  loadFormations() {
    this.loading = true;
    this.formationService.getAllFormations({ page: 0, size: 6, status: 'PUBLISHED' }).subscribe({
      next: p => { this.recentFormations = p.content; this.totalFormations = p.totalElements; this.loading = false; },
      error: () => this.loading = false
    });
  }

  calcCompletion(p: Profil) {
    let score = 20; // base for having account
    if (p.bio) score += 20;
    if (p.address) score += 20;
    if (p.dateOfBirth) score += 20;
    if (this.competences.length > 0) score += 20;
    this.completionPercent = score;
  }

  getLevelColor(level: string) { return { BEGINNER: 'success', INTERMEDIATE: 'warning', ADVANCED: 'danger', EXPERT: 'secondary' }[level] ?? 'primary'; }
  getLevelBadge(level: string) { return { BEGINNER: 'success', INTERMEDIATE: 'warning', ADVANCED: 'danger' }[level] ?? 'primary'; }
}
