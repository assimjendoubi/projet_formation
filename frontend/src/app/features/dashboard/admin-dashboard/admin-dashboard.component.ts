import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { UserService } from '../../../core/services/user.service';
import { DashboardStats } from '../../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <div class="main-content">
        <div class="page-content">
          <div class="page-header">
            <h1>Tableau de Bord <span class="gradient-text">Administration</span></h1>
            <p>Vue d'ensemble de la plateforme de formation</p>
          </div>

          @if (loading) {
            <div class="loading-container"><div class="spinner"></div><p>Chargement...</p></div>
          } @else if (stats) {
            <div class="stats-grid">
              <div class="stat-card stat-card-purple">
                <div class="stat-icon">👥</div>
                <div class="stat-value">{{ stats.totalUsers }}</div>
                <div class="stat-label">Utilisateurs</div>
              </div>
              <div class="stat-card stat-card-cyan">
                <div class="stat-icon">🎓</div>
                <div class="stat-value">{{ stats.totalLearners }}</div>
                <div class="stat-label">Apprenants</div>
              </div>
              <div class="stat-card stat-card-green">
                <div class="stat-icon">📚</div>
                <div class="stat-value">{{ stats.totalFormations }}</div>
                <div class="stat-label">Formations</div>
              </div>
              <div class="stat-card stat-card-yellow">
                <div class="stat-icon">🏷️</div>
                <div class="stat-value">{{ stats.totalCategories }}</div>
                <div class="stat-label">Catégories</div>
              </div>
              <div class="stat-card stat-card-green">
                <div class="stat-icon">✅</div>
                <div class="stat-value">{{ stats.publishedFormations }}</div>
                <div class="stat-label">Publiées</div>
              </div>
              <div class="stat-card stat-card-violet">
                <div class="stat-icon">📝</div>
                <div class="stat-value">{{ stats.draftFormations }}</div>
                <div class="stat-label">Brouillons</div>
              </div>
            </div>

            <!-- Quick Actions -->
            <h2 class="mt-4 mb-4">Gestion Rapide</h2>
            <div class="admin-actions-grid">
              <a routerLink="/admin/users" class="admin-action-card">
                <div class="action-icon">👥</div>
                <div class="action-title">Gérer les Utilisateurs</div>
                <div class="action-desc">{{ stats.totalUsers }} utilisateurs enregistrés</div>
              </a>
              <a routerLink="/admin/formations" class="admin-action-card">
                <div class="action-icon">🎓</div>
                <div class="action-title">Gérer les Formations</div>
                <div class="action-desc">{{ stats.totalFormations }} formations au catalogue</div>
              </a>
              <a routerLink="/catalog" class="admin-action-card">
                <div class="action-icon">📚</div>
                <div class="action-title">Voir le Catalogue</div>
                <div class="action-desc">{{ stats.publishedFormations }} formations publiées</div>
              </a>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid { grid-template-columns: repeat(3, 1fr); }
    .admin-actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .admin-action-card {
      display: flex; flex-direction: column; align-items: center; text-align: center;
      padding: 28px 20px; border-radius: var(--radius-lg); background: var(--bg-card);
      border: 1px solid var(--border); text-decoration: none; color: var(--text-primary);
      transition: var(--transition-slow); gap: 8px;
    }
    .admin-action-card:hover { transform: translateY(-6px); border-color: rgba(99,102,241,0.4); box-shadow: var(--shadow-md); }
    .action-icon { font-size: 2.5rem; }
    .action-title { font-weight: 700; font-size: 1rem; }
    .action-desc { font-size: 0.8rem; color: var(--text-muted); }
    @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .admin-actions-grid { grid-template-columns: 1fr; } }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getDashboardStats().subscribe({
      next: s => { this.stats = s; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
