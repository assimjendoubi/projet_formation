import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { FormationService } from '../../../core/services/formation.service';
import { Formation, Category } from '../../../core/models/models';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <div class="main-content">
        <div class="page-content">
          <div class="page-header">
            <h1>Catalogue de <span class="gradient-text">Formations</span></h1>
            <p>{{ totalElements }} formation(s) disponible(s)</p>
          </div>

          <!-- Filter Bar -->
          <div class="filter-bar">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input type="text" class="form-control" [(ngModel)]="searchTitle"
                     (ngModelChange)="onSearch()" placeholder="Rechercher une formation..." />
            </div>

            <select class="form-control" style="width: 180px;" [(ngModel)]="selectedCategory" (change)="onFilter()">
              <option value="">Toutes les catégories</option>
              @for (cat of categories; track cat.id) {
                <option [value]="cat.id">{{ cat.name }}</option>
              }
            </select>

            <select class="form-control" style="width: 160px;" [(ngModel)]="selectedLevel" (change)="onFilter()">
              <option value="">Tous les niveaux</option>
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
              <option value="ADVANCED">Avancé</option>
            </select>

            <select class="form-control" style="width: 160px;" [(ngModel)]="sortBy" (change)="onFilter()">
              <option value="createdAt">Plus récentes</option>
              <option value="title">Titre A-Z</option>
              <option value="price">Prix</option>
            </select>

            @if (isAdmin) {
              <select class="form-control" style="width: 150px;" [(ngModel)]="selectedStatus" (change)="onFilter()">
                <option value="">Tous statuts</option>
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publiée</option>
                <option value="ARCHIVED">Archivée</option>
              </select>
            }

            <button class="btn btn-secondary btn-sm" (click)="clearFilters()">Réinitialiser</button>
          </div>

          <!-- Loading -->
          @if (loading) {
            <div class="loading-container"><div class="spinner"></div><p>Chargement des formations...</p></div>
          } @else {
            <!-- Empty -->
            @if (formations.length === 0) {
              <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>Aucune formation trouvée</h3>
                <p>Essayez de modifier vos critères de recherche</p>
              </div>
            } @else {
              <!-- Formation Grid -->
              <div class="formations-grid">
              @for (f of formations; track f.id) {
                <a [routerLink]="['/formations', f.id]" class="formation-card" style="text-decoration:none; color:inherit;">
                  <div class="formation-card-header">
                    <div class="flex items-center justify-between mb-2">
                      <span class="badge badge-primary">{{ f.category?.name }}</span>
                      <div class="flex gap-2">
                        <span class="badge badge-{{ getLevelBadge(f.level) }}">{{ getLevelLabel(f.level) }}</span>
                        @if (isAdmin) {
                          <span class="badge badge-{{ getStatusBadge(f.status) }}">{{ f.status }}</span>
                        }
                      </div>
                    </div>
                    <h3 class="formation-title">{{ f.title }}</h3>
                  </div>
                  <div class="formation-card-body">
                    <p class="formation-description">{{ f.description }}</p>
                    <div class="formation-meta">
                      <span>⏱ {{ f.durationHours }}h</span>
                      <span>📖 {{ f.chapitreCount }} chapitres</span>
                    </div>
                  </div>
                  <div class="formation-card-footer">
                    <span class="formation-price">{{ f.price }} TND</span>
                    <span class="btn btn-primary btn-sm">Voir →</span>
                  </div>
                </a>
              }
            </div>

            <!-- Pagination -->
            @if (totalPages > 1) {
              <div class="pagination">
                <button class="page-btn" [disabled]="currentPage === 0" (click)="goToPage(currentPage - 1)">‹</button>
                @for (p of getPages(); track p) {
                  <button class="page-btn" [class.active]="p === currentPage" (click)="goToPage(p)">{{ p + 1 }}</button>
                }
                <button class="page-btn" [disabled]="currentPage === totalPages - 1" (click)="goToPage(currentPage + 1)">›</button>
              </div>
            }
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class CatalogComponent implements OnInit {
  formations: Formation[] = [];
  categories: Category[] = [];
  loading = false;
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 9;

  searchTitle = '';
  selectedCategory = '';
  selectedLevel = '';
  selectedStatus = '';
  sortBy = 'createdAt';
  searchTimeout: any;
  isAdmin = false;

  constructor(private formationService: FormationService) {}

  ngOnInit() {
    this.formationService.getAllCategories().subscribe(c => this.categories = c);
    this.loadFormations();
  }

  loadFormations() {
    this.loading = true;
    const params: any = { page: this.currentPage, size: this.pageSize, sortBy: this.sortBy, sortDir: 'desc' };
    if (this.searchTitle) params.title = this.searchTitle;
    if (this.selectedCategory) params.categoryId = Number(this.selectedCategory);
    if (this.selectedLevel) params.level = this.selectedLevel;
    if (this.selectedStatus) params.status = this.selectedStatus;
    this.formationService.getAllFormations(params).subscribe({
      next: p => { this.formations = p.content; this.totalElements = p.totalElements; this.totalPages = p.totalPages; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 0; this.loadFormations(); }, 400);
  }

  onFilter() { this.currentPage = 0; this.loadFormations(); }

  clearFilters() { this.searchTitle = ''; this.selectedCategory = ''; this.selectedLevel = ''; this.selectedStatus = ''; this.sortBy = 'createdAt'; this.currentPage = 0; this.loadFormations(); }

  goToPage(page: number) { this.currentPage = page; this.loadFormations(); }

  getPages(): number[] {
    const pages = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  getLevelBadge(level: string) { return { BEGINNER: 'success', INTERMEDIATE: 'warning', ADVANCED: 'danger' }[level] ?? 'primary'; }
  getLevelLabel(level: string) { return { BEGINNER: 'Débutant', INTERMEDIATE: 'Intermédiaire', ADVANCED: 'Avancé' }[level] ?? level; }
  getStatusBadge(status: string) { return { DRAFT: 'secondary', PUBLISHED: 'success', ARCHIVED: 'danger' }[status] ?? 'primary'; }
}
