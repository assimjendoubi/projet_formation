import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { FormationService } from '../../../core/services/formation.service';
import { AuthService } from '../../../core/services/auth.service';
import { Formation, Chapitre } from '../../../core/models/models';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <div class="main-content">
        <div class="page-content">
          @if (loading) {
            <div class="loading-container"><div class="spinner"></div><p>Chargement...</p></div>
          } @else if (formation) {
            <!-- Breadcrumb -->
            <div class="breadcrumb mb-4">
              <a routerLink="/catalog">← Retour au catalogue</a>
            </div>

            <!-- Formation Hero -->
            <div class="formation-hero">
              <div class="hero-content">
                <div class="flex gap-2 mb-3">
                  <span class="badge badge-primary">{{ formation.category?.name }}</span>
                  <span class="badge badge-{{ getLevelBadge(formation.level) }}">{{ getLevelLabel(formation.level) }}</span>
                  @if (isAdmin()) {
                    <span class="badge badge-{{ getStatusBadge(formation.status) }}">{{ formation.status }}</span>
                  }
                </div>
                <h1>{{ formation.title }}</h1>
                <p class="hero-desc">{{ formation.description }}</p>

                <div class="hero-meta">
                  <div class="meta-item">
                    <span class="meta-icon">⏱</span>
                    <span><strong>{{ formation.durationHours }}</strong> heures</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">📖</span>
                    <span><strong>{{ chapters.length }}</strong> chapitres</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span>{{ formation.createdAt | date:'dd/MM/yyyy' }}</span>
                  </div>
                </div>
              </div>
              <div class="hero-price-card">
                <div class="price">{{ formation.price }}€</div>
                <p class="text-muted text-sm">Accès complet à la formation</p>
              </div>
            </div>

            <!-- Objectives -->
            @if (formation.objectives) {
              <div class="card mb-6">
                <div class="card-body">
                  <h3>🎯 Objectifs de la formation</h3>
                  <p class="mt-2" style="color: var(--text-secondary); line-height: 1.8;">{{ formation.objectives }}</p>
                </div>
              </div>
            }

            <!-- Chapters -->
            <div class="card">
              <div class="card-header">
                <h3>📚 Programme ({{ chapters.length }} chapitres)</h3>
              </div>
              <div class="card-body" style="padding: 0;">
                @for (ch of chapters; track ch.id; let i = $index) {
                  <div class="chapter-item" [class.active]="expandedChapter === ch.id" (click)="toggleChapter(ch.id)">
                    <div class="chapter-header">
                      <div class="chapter-number">{{ ch.chapterOrder }}</div>
                      <div class="chapter-info">
                        <h4>{{ ch.title }}</h4>
                        @if (ch.description) { <p class="text-sm text-muted">{{ ch.description }}</p> }
                      </div>
                      <span class="chapter-toggle">{{ expandedChapter === ch.id ? '▲' : '▼' }}</span>
                    </div>
                    @if (expandedChapter === ch.id && ch.content) {
                      <div class="chapter-content">
                        <p>{{ ch.content }}</p>
                      </div>
                    }
                  </div>
                }
                @if (chapters.length === 0) {
                  <div class="empty-state" style="padding: 40px;"><div class="empty-icon">📭</div><p>Aucun chapitre disponible</p></div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb a { color: var(--primary-light); font-size: 0.875rem; }
    .formation-hero { display: flex; gap: 24px; align-items: flex-start; margin-bottom: 28px; padding: 32px; background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08)); border: 1px solid rgba(99,102,241,0.2); border-radius: var(--radius-xl); }
    .hero-content { flex: 1; }
    .hero-content h1 { font-size: 2rem; margin-bottom: 12px; }
    .hero-desc { color: var(--text-secondary); font-size: 1rem; line-height: 1.7; margin-bottom: 20px; }
    .hero-meta { display: flex; gap: 24px; }
    .meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.875rem; color: var(--text-secondary); }
    .meta-icon { font-size: 1rem; }
    .hero-price-card { background: rgba(255,255,255,0.06); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; text-align: center; min-width: 180px; flex-shrink: 0; }
    .price { font-size: 2.5rem; font-weight: 800; background: linear-gradient(135deg, var(--primary-light), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .chapter-item { border-bottom: 1px solid rgba(255,255,255,0.05); transition: var(--transition); cursor: pointer; }
    .chapter-item:last-child { border-bottom: none; }
    .chapter-item:hover { background: rgba(255,255,255,0.02); }
    .chapter-header { display: flex; align-items: center; gap: 16px; padding: 18px 24px; }
    .chapter-number { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: white; flex-shrink: 0; }
    .chapter-info { flex: 1; }
    .chapter-info h4 { font-size: 0.95rem; font-weight: 600; margin-bottom: 2px; }
    .chapter-toggle { color: var(--text-muted); font-size: 0.75rem; }
    .chapter-content { padding: 0 24px 20px 76px; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7; }
    @media (max-width: 768px) { .formation-hero { flex-direction: column; } .hero-price-card { width: 100%; } }
  `]
})
export class FormationDetailComponent implements OnInit {
  formation: Formation | null = null;
  chapters: Chapitre[] = [];
  loading = true;
  expandedChapter: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private authService: AuthService
  ) {}

  isAdmin = () => this.authService.isAdmin();

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.formationService.getFormationById(id).subscribe({
      next: f => { this.formation = f; this.loading = false; this.loadChapters(id); },
      error: () => this.loading = false
    });
  }

  loadChapters(id: number) {
    this.formationService.getChaptersByFormation(id).subscribe({
      next: c => this.chapters = c,
      error: () => {}
    });
  }

  toggleChapter(id: number) { this.expandedChapter = this.expandedChapter === id ? null : id; }

  getLevelBadge(level: string) { return { BEGINNER: 'success', INTERMEDIATE: 'warning', ADVANCED: 'danger' }[level] ?? 'primary'; }
  getLevelLabel(level: string) { return { BEGINNER: 'Débutant', INTERMEDIATE: 'Intermédiaire', ADVANCED: 'Avancé' }[level] ?? level; }
  getStatusBadge(status: string) { return { DRAFT: 'secondary', PUBLISHED: 'success', ARCHIVED: 'danger' }[status] ?? 'primary'; }
}
