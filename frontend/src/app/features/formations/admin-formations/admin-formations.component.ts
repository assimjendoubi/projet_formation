import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { FormationService } from '../../../core/services/formation.service';
import { Formation, Category, Chapitre } from '../../../core/models/models';

type ModalMode = 'createFormation' | 'editFormation' | 'createCategory' | 'editCategory' | 'createChapter' | 'editChapter' | 'viewChapters' | null;

@Component({
  selector: 'app-admin-formations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <div class="main-content">
        <div class="page-content">
          <div class="page-header">
            <div class="flex items-center justify-between">
              <div>
                <h1>Gestion des <span class="gradient-text">Formations</span></h1>
                <p>{{ totalElements }} formation(s) · {{ categories.length }} catégorie(s)</p>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-secondary btn-sm" (click)="openModal('createCategory')">🏷️ Catégorie</button>
                <button class="btn btn-primary" (click)="openModal('createFormation')">+ Formation</button>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="tabs mb-6">
            <button class="tab-btn" [class.active]="activeTab === 'formations'" (click)="activeTab = 'formations'">📚 Formations ({{ totalElements }})</button>
            <button class="tab-btn" [class.active]="activeTab === 'categories'" (click)="activeTab = 'categories'">🏷️ Catégories ({{ categories.length }})</button>
          </div>

          <!-- Formations Tab -->
          @if (activeTab === 'formations') {
            <div class="filter-bar mb-4">
              <div class="search-input-wrapper">
                <span class="search-icon">🔍</span>
                <input type="text" class="form-control" [(ngModel)]="searchTitle" (input)="onSearch()" placeholder="Rechercher..." />
              </div>
              <select class="form-control" style="width: 180px;" [(ngModel)]="filterStatus" (change)="loadFormations()">
                <option value="">Tous statuts</option>
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publiée</option>
                <option value="ARCHIVED">Archivée</option>
              </select>
              <select class="form-control" style="width: 180px;" [(ngModel)]="filterCategory" (change)="loadFormations()">
                <option value="">Toutes catégories</option>
                @for (cat of categories; track cat.id) { <option [value]="cat.id">{{ cat.name }}</option> }
              </select>
            </div>

            @if (loading) { <div class="loading-container"><div class="spinner"></div></div> }
            @else {
              <div class="card">
                <div class="table-container">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Formation</th>
                        <th>Catégorie</th>
                        <th>Niveau</th>
                        <th>Statut</th>
                        <th>Prix</th>
                        <th>Chapitres</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (f of formations; track f.id) {
                        <tr>
                          <td>
                            <div>
                              <div class="font-semibold" style="max-width: 250px;" class="truncate">{{ f.title }}</div>
                              <div class="text-xs text-muted">{{ f.durationHours }}h</div>
                            </div>
                          </td>
                          <td><span class="badge badge-primary">{{ f.category?.name }}</span></td>
                          <td><span class="badge badge-{{ getLevelBadge(f.level) }}">{{ f.level }}</span></td>
                          <td><span class="badge badge-{{ getStatusBadge(f.status) }}">{{ f.status }}</span></td>
                          <td class="font-semibold" style="color: var(--primary-light);">{{ f.price }} TND</td>
                          <td>
                            <button class="btn btn-sm btn-secondary" (click)="openChapters(f)">📖 {{ f.chapitreCount }}</button>
                          </td>
                          <td>
                            <div class="flex gap-1">
                              @if (f.status === 'DRAFT') {
                                <button class="btn btn-success btn-sm" (click)="publishFormation(f)" title="Publier">✅</button>
                              }
                              @if (f.status === 'PUBLISHED') {
                                <button class="btn btn-warning btn-sm" (click)="archiveFormation(f)" title="Archiver">📦</button>
                              }
                              <button class="btn btn-secondary btn-sm" (click)="openEdit(f)">✏️</button>
                              <button class="btn btn-danger btn-sm" (click)="confirmDelete(f)">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
                @if (totalPages > 1) {
                  <div class="pagination">
                    <button class="page-btn" [disabled]="currentPage === 0" (click)="goToPage(currentPage - 1)">‹</button>
                    @for (p of getPages(); track p) {
                      <button class="page-btn" [class.active]="p === currentPage" (click)="goToPage(p)">{{ p + 1 }}</button>
                    }
                    <button class="page-btn" [disabled]="currentPage === totalPages - 1" (click)="goToPage(currentPage + 1)">›</button>
                  </div>
                }
              </div>
            }
          }

          <!-- Categories Tab -->
          @if (activeTab === 'categories') {
            <div class="categories-grid">
              @for (cat of categories; track cat.id) {
                <div class="cat-card">
                  <div class="cat-icon">🏷️</div>
                  <div class="cat-info">
                    <h4>{{ cat.name }}</h4>
                    <p class="text-sm text-muted">{{ cat.description || 'Pas de description' }}</p>
                    <span class="badge badge-primary mt-2">{{ cat.formationCount }} formations</span>
                  </div>
                  <div class="flex gap-2 mt-3">
                    <button class="btn btn-secondary btn-sm" (click)="openEditCategory(cat)">✏️ Modifier</button>
                    <button class="btn btn-danger btn-sm" (click)="deleteCategory(cat.id)">🗑️</button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Formation Modal -->
    @if (modalMode === 'createFormation' || modalMode === 'editFormation') {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" style="max-width: 620px;" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">{{ modalMode === 'createFormation' ? 'Nouvelle Formation' : 'Modifier la Formation' }}</h3>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <form [formGroup]="formationForm" (ngSubmit)="saveFormation()">
            <div class="form-group">
              <label>Titre</label>
              <input type="text" class="form-control" formControlName="title" placeholder="Titre de la formation" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea class="form-control" formControlName="description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Objectifs</label>
              <textarea class="form-control" formControlName="objectives" rows="2" placeholder="Ce que les apprenants apprendront..."></textarea>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label>Prix (TND)</label>
                <input type="number" class="form-control" formControlName="price" min="0" step="0.01" />
              </div>
              <div class="form-group">
                <label>Durée (heures)</label>
                <input type="number" class="form-control" formControlName="durationHours" min="1" />
              </div>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label>Niveau</label>
                <select class="form-control" formControlName="level">
                  <option value="BEGINNER">Débutant</option>
                  <option value="INTERMEDIATE">Intermédiaire</option>
                  <option value="ADVANCED">Avancé</option>
                </select>
              </div>
              <div class="form-group">
                <label>Catégorie</label>
                <select class="form-control" formControlName="categoryId">
                  <option value="">Choisir une catégorie</option>
                  @for (cat of categories; track cat.id) { <option [value]="cat.id">{{ cat.name }}</option> }
                </select>
              </div>
            </div>
            <div class="flex gap-2 mt-4">
              <button type="submit" class="btn btn-primary" [disabled]="formationForm.invalid || saving">{{ saving ? 'Sauvegarde...' : '💾 Sauvegarder' }}</button>
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Category Modal -->
    @if (modalMode === 'createCategory' || modalMode === 'editCategory') {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" style="max-width: 480px;" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">{{ modalMode === 'createCategory' ? 'Nouvelle Catégorie' : 'Modifier la Catégorie' }}</h3>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
            <div class="form-group">
              <label>Nom</label>
              <input type="text" class="form-control" formControlName="name" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea class="form-control" formControlName="description" rows="3"></textarea>
            </div>
            <div class="flex gap-2 mt-4">
              <button type="submit" class="btn btn-primary" [disabled]="categoryForm.invalid || saving">{{ saving ? '...' : '💾 Sauvegarder' }}</button>
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Chapters Modal -->
    @if (modalMode === 'viewChapters' && selectedFormation) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" style="max-width: 700px; max-height: 80vh; overflow-y: auto;" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">📖 Chapitres : {{ selectedFormation.title }}</h3>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>

          <!-- Add Chapter Form -->
          <form [formGroup]="chapterForm" (ngSubmit)="saveChapter()" class="add-comp-form mb-4">
            <input type="text" class="form-control" formControlName="title" placeholder="Titre du chapitre" style="flex:1;" />
            <input type="number" class="form-control" formControlName="chapterOrder" placeholder="Ordre" style="width:80px;" min="1" />
            <button type="submit" class="btn btn-primary btn-sm" [disabled]="chapterForm.invalid || saving">+ Ajouter</button>
          </form>

          @if (chaptersLoading) { <div class="loading-container"><div class="spinner"></div></div> }
          @else {
            <div class="chapter-list">
              @for (ch of chapters; track ch.id) {
                <div class="chapter-row">
                  <div class="chapter-num">{{ ch.chapterOrder }}</div>
                  <div class="chapter-text">
                    <div class="font-semibold text-sm">{{ ch.title }}</div>
                    @if (ch.description) { <div class="text-xs text-muted">{{ ch.description }}</div> }
                  </div>
                  <button class="btn btn-danger btn-sm btn-icon" (click)="deleteChapter(ch.id)">✕</button>
                </div>
              }
              @if (chapters.length === 0) { <p class="text-muted text-center" style="padding: 20px;">Aucun chapitre. Ajoutez-en un ci-dessus.</p> }
            </div>
          }
        </div>
      </div>
    }

    <!-- Delete Confirmation -->
    @if (showDeleteModal) {
      <div class="modal-overlay" (click)="showDeleteModal = false">
        <div class="modal" style="max-width: 420px;" (click)="$event.stopPropagation()">
          <div class="modal-header"><h3 class="modal-title">Confirmer la suppression</h3><button class="modal-close" (click)="showDeleteModal = false">✕</button></div>
          <p class="text-secondary mb-6">Supprimer la formation <strong>{{ selectedFormation?.title }}</strong> et tous ses chapitres ?</p>
          <div class="flex gap-2">
            <button class="btn btn-danger" (click)="deleteFormation()" [disabled]="saving">🗑️ Supprimer</button>
            <button class="btn btn-secondary" (click)="showDeleteModal = false">Annuler</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 4px; border: 1px solid var(--border); width: fit-content; }
    .tab-btn { padding: 8px 20px; border-radius: 9px; border: none; background: none; color: var(--text-muted); cursor: pointer; font-size: 0.875rem; font-family: 'Inter', sans-serif; transition: var(--transition); font-weight: 500; }
    .tab-btn.active { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; box-shadow: 0 2px 10px rgba(99,102,241,0.3); }
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .cat-card { padding: 20px; border-radius: var(--radius-lg); background: var(--bg-card); border: 1px solid var(--border); display: flex; flex-direction: column; transition: var(--transition); }
    .cat-card:hover { border-color: rgba(99,102,241,0.3); }
    .cat-icon { font-size: 2rem; margin-bottom: 12px; }
    .cat-info h4 { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
    .add-comp-form { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
    .chapter-list { display: flex; flex-direction: column; gap: 8px; }
    .chapter-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(255,255,255,0.04); border-radius: 10px; border: 1px solid var(--border); }
    .chapter-num { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: white; flex-shrink: 0; }
    .chapter-text { flex: 1; }
  `]
})
export class AdminFormationsComponent implements OnInit {
  formations: Formation[] = [];
  categories: Category[] = [];
  chapters: Chapitre[] = [];
  loading = false;
  chaptersLoading = false;
  saving = false;
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;
  activeTab: 'formations' | 'categories' = 'formations';
  modalMode: ModalMode = null;
  showDeleteModal = false;
  selectedFormation: Formation | null = null;
  selectedCategory: Category | null = null;
  searchTitle = '';
  filterStatus = '';
  filterCategory = '';
  searchTimeout: any;

  formationForm: FormGroup;
  categoryForm: FormGroup;
  chapterForm: FormGroup;

  constructor(private formationService: FormationService, private fb: FormBuilder) {
    this.formationForm = this.fb.group({ title: ['', Validators.required], description: ['', Validators.required], objectives: [''], price: [0, [Validators.required, Validators.min(0)]], durationHours: [1, [Validators.required, Validators.min(1)]], level: ['BEGINNER', Validators.required], categoryId: ['', Validators.required] });
    this.categoryForm = this.fb.group({ name: ['', Validators.required], description: [''] });
    this.chapterForm = this.fb.group({ title: ['', Validators.required], description: [''], content: [''], chapterOrder: [1, [Validators.required, Validators.min(1)]] });
  }

  ngOnInit() { this.loadCategories(); this.loadFormations(); }

  loadFormations() {
    this.loading = true;
    const params: any = { page: this.currentPage, size: this.pageSize };
    if (this.searchTitle) params.title = this.searchTitle;
    if (this.filterStatus) params.status = this.filterStatus;
    if (this.filterCategory) params.categoryId = Number(this.filterCategory);
    this.formationService.getAllFormations(params).subscribe({
      next: p => { this.formations = p.content; this.totalElements = p.totalElements; this.totalPages = p.totalPages; this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadCategories() { this.formationService.getAllCategories().subscribe(c => this.categories = c); }

  onSearch() { clearTimeout(this.searchTimeout); this.searchTimeout = setTimeout(() => { this.currentPage = 0; this.loadFormations(); }, 400); }

  openModal(mode: ModalMode) {
    this.modalMode = mode;
    if (mode === 'createFormation') this.formationForm.reset({ level: 'BEGINNER', price: 0, durationHours: 1 });
    if (mode === 'createCategory') this.categoryForm.reset();
  }

  openEdit(f: Formation) {
    this.selectedFormation = f;
    this.formationForm.patchValue({ ...f, categoryId: f.category?.id });
    this.modalMode = 'editFormation';
  }

  openEditCategory(cat: Category) {
    this.selectedCategory = cat;
    this.categoryForm.patchValue(cat);
    this.modalMode = 'editCategory';
  }

  openChapters(f: Formation) {
    this.selectedFormation = f;
    this.modalMode = 'viewChapters';
    this.chaptersLoading = true;
    this.chapterForm.patchValue({ chapterOrder: f.chapitreCount + 1 });
    this.formationService.getChaptersByFormation(f.id).subscribe({ next: c => { this.chapters = c; this.chaptersLoading = false; }, error: () => this.chaptersLoading = false });
  }

  closeModal() { this.modalMode = null; this.selectedFormation = null; this.selectedCategory = null; }

  saveFormation() {
    if (this.formationForm.invalid) return;
    this.saving = true;
    const data = { ...this.formationForm.value, categoryId: Number(this.formationForm.value.categoryId) };
    const req = this.modalMode === 'createFormation' ? this.formationService.createFormation(data) : this.formationService.updateFormation(this.selectedFormation!.id, data);
    req.subscribe({ next: () => { this.loadFormations(); this.saving = false; this.closeModal(); }, error: () => this.saving = false });
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;
    this.saving = true;
    const req = this.modalMode === 'createCategory' ? this.formationService.createCategory(this.categoryForm.value) : this.formationService.updateCategory(this.selectedCategory!.id, this.categoryForm.value);
    req.subscribe({ next: () => { this.loadCategories(); this.saving = false; this.closeModal(); }, error: () => this.saving = false });
  }

  saveChapter() {
    if (this.chapterForm.invalid || !this.selectedFormation) return;
    this.saving = true;
    this.formationService.createChapter(this.selectedFormation.id, this.chapterForm.value).subscribe({
      next: c => { this.chapters.push(c); this.chapters.sort((a, b) => a.chapterOrder - b.chapterOrder); this.selectedFormation!.chapitreCount++; this.chapterForm.patchValue({ title: '', description: '', chapterOrder: this.chapters.length + 1 }); this.saving = false; },
      error: () => this.saving = false
    });
  }

  deleteChapter(id: number) {
    this.formationService.deleteChapter(id).subscribe({ next: () => { this.chapters = this.chapters.filter(c => c.id !== id); if (this.selectedFormation) this.selectedFormation.chapitreCount--; }, error: () => {} });
  }

  publishFormation(f: Formation) {
    this.formationService.publishFormation(f.id).subscribe({ next: updated => { const idx = this.formations.findIndex(x => x.id === updated.id); if (idx !== -1) this.formations[idx] = updated; }, error: () => {} });
  }

  archiveFormation(f: Formation) {
    this.formationService.archiveFormation(f.id).subscribe({ next: updated => { const idx = this.formations.findIndex(x => x.id === updated.id); if (idx !== -1) this.formations[idx] = updated; }, error: () => {} });
  }

  confirmDelete(f: Formation) { this.selectedFormation = f; this.showDeleteModal = true; }

  deleteFormation() {
    if (!this.selectedFormation) return;
    this.saving = true;
    this.formationService.deleteFormation(this.selectedFormation.id).subscribe({ next: () => { this.loadFormations(); this.saving = false; this.showDeleteModal = false; }, error: () => this.saving = false });
  }

  goToPage(page: number) { this.currentPage = page; this.loadFormations(); }
  getPages(): number[] { const pages = []; const s = Math.max(0, this.currentPage - 2); const e = Math.min(this.totalPages - 1, this.currentPage + 2); for (let i = s; i <= e; i++) pages.push(i); return pages; }
  getLevelBadge(level: string) { return { BEGINNER: 'success', INTERMEDIATE: 'warning', ADVANCED: 'danger' }[level] ?? 'primary'; }
  getStatusBadge(status: string) { return { DRAFT: 'secondary', PUBLISHED: 'success', ARCHIVED: 'danger' }[status] ?? 'primary'; }
  deleteCategory(id: number) { if (confirm('Supprimer cette catégorie ?')) { this.formationService.deleteCategory(id).subscribe(() => this.loadCategories()); } }
}
