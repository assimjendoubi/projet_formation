import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, Role } from '../../../core/models/models';

@Component({
  selector: 'app-admin-users',
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
                <h1>Gestion des <span class="gradient-text">Utilisateurs</span></h1>
                <p>{{ totalElements }} utilisateurs enregistrés</p>
              </div>
            </div>
          </div>

          <!-- Search -->
          <div class="filter-bar mb-4">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input type="text" class="form-control" [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Rechercher un utilisateur..." />
            </div>
          </div>

          <!-- Table -->
          @if (loading) {
            <div class="loading-container"><div class="spinner"></div></div>
          } @else {
            <div class="card">
              <div class="table-container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>Date d'inscription</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (user of filteredUsers; track user.id) {
                      <tr>
                        <td>
                          <div class="user-cell">
                            <div class="user-avatar-sm">{{ getInitials(user) }}</div>
                            <span class="font-semibold">{{ user.firstName }} {{ user.lastName }}</span>
                          </div>
                        </td>
                        <td class="text-secondary text-sm">{{ user.email }}</td>
                        <td>
                          <span class="badge" [class]="'badge-' + (user.role === 'ADMIN' ? 'warning' : 'primary')">
                            {{ user.role === 'ADMIN' ? '👑 Admin' : '🎓 Apprenant' }}
                          </span>
                        </td>
                        <td>
                          <span class="badge" [class]="user.enabled ? 'badge-success' : 'badge-danger'">
                            {{ user.enabled ? '✓ Actif' : '✗ Inactif' }}
                          </span>
                        </td>
                        <td class="text-muted text-sm">{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
                        <td>
                          <div class="flex gap-2">
                            <button class="btn btn-secondary btn-sm" (click)="openEdit(user)">✏️</button>
                            <button class="btn btn-danger btn-sm" (click)="confirmDelete(user)"
                                    [disabled]="user.id === currentUserId">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    }
                    @if (filteredUsers.length === 0) {
                      <tr><td colspan="6" style="text-align:center; padding:32px; color:var(--text-muted);">Aucun utilisateur trouvé</td></tr>
                    }
                  </tbody>
                </table>
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
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    @if (showEditModal) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Modifier l'utilisateur</h3>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <form [formGroup]="editForm" (ngSubmit)="saveUser()">
            <div class="grid-2">
              <div class="form-group">
                <label>Prénom</label>
                <input type="text" class="form-control" formControlName="firstName" />
              </div>
              <div class="form-group">
                <label>Nom</label>
                <input type="text" class="form-control" formControlName="lastName" />
              </div>
            </div>
            <div class="form-group">
              <label>Téléphone</label>
              <input type="tel" class="form-control" formControlName="phone" />
            </div>
            <div class="form-group">
              <label>Rôle</label>
              <select class="form-control" formControlName="role">
                <option value="LEARNER">Apprenant</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </div>
            <div class="form-group">
              <label>Statut du compte</label>
              <select class="form-control" formControlName="enabled">
                <option [value]="true">Actif</option>
                <option [value]="false">Inactif</option>
              </select>
            </div>
            <div class="flex gap-2 mt-4">
              <button type="submit" class="btn btn-primary" [disabled]="saving">{{ saving ? 'Sauvegarde...' : '💾 Sauvegarder' }}</button>
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Delete Modal -->
    @if (showDeleteModal) {
      <div class="modal-overlay" (click)="showDeleteModal = false">
        <div class="modal" (click)="$event.stopPropagation()" style="max-width: 420px;">
          <div class="modal-header">
            <h3 class="modal-title">Confirmer la suppression</h3>
            <button class="modal-close" (click)="showDeleteModal = false">✕</button>
          </div>
          <p class="text-secondary mb-6">Êtes-vous sûr de vouloir supprimer <strong>{{ selectedUser?.firstName }} {{ selectedUser?.lastName }}</strong> ? Cette action est irréversible.</p>
          <div class="flex gap-2">
            <button class="btn btn-danger" (click)="deleteUser()" [disabled]="saving">{{ saving ? 'Suppression...' : '🗑️ Supprimer' }}</button>
            <button class="btn btn-secondary" (click)="showDeleteModal = false">Annuler</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .user-avatar-sm { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: white; flex-shrink: 0; }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;
  searchTerm = '';

  showEditModal = false;
  showDeleteModal = false;
  selectedUser: User | null = null;
  editForm: FormGroup;
  saving = false;
  currentUserId: number | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      role: ['LEARNER'],
      enabled: [true]
    });
  }

  ngOnInit() {
    this.currentUserId = this.authService.currentUser()?.userId ?? null;
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: p => { this.users = p.content; this.filteredUsers = p.content; this.totalElements = p.totalElements; this.totalPages = p.totalPages; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.firstName.toLowerCase().includes(term) ||
      u.lastName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  openEdit(user: User) { this.selectedUser = user; this.editForm.patchValue({ ...user }); this.showEditModal = true; }
  closeModal() { this.showEditModal = false; this.selectedUser = null; }

  saveUser() {
    if (!this.selectedUser) return;
    this.saving = true;
    this.userService.updateUser(this.selectedUser.id, this.editForm.value).subscribe({
      next: updated => {
        const idx = this.users.findIndex(u => u.id === updated.id);
        if (idx !== -1) { this.users[idx] = updated; this.onSearch(); }
        this.saving = false; this.closeModal();
      },
      error: () => this.saving = false
    });
  }

  confirmDelete(user: User) { this.selectedUser = user; this.showDeleteModal = true; }

  deleteUser() {
    if (!this.selectedUser) return;
    this.saving = true;
    this.userService.deleteUser(this.selectedUser.id).subscribe({
      next: () => { this.users = this.users.filter(u => u.id !== this.selectedUser?.id); this.totalElements--; this.onSearch(); this.saving = false; this.showDeleteModal = false; },
      error: () => this.saving = false
    });
  }

  goToPage(page: number) { this.currentPage = page; this.loadUsers(); }

  getPages(): number[] {
    const pages = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  getInitials(u: User) { return (u.firstName[0] + u.lastName[0]).toUpperCase(); }
}
