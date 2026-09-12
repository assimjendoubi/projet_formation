import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">🎓</div>
        <div class="brand-text">
          <span class="brand-name">TrainPro</span>
          <span class="brand-role">{{ isAdmin() ? 'Administration' : 'Apprenant' }}</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        @if (!isAdmin()) {
          <div class="nav-section">
            <span class="nav-section-title">Navigation</span>
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🏠</span> Tableau de bord
            </a>
            <a routerLink="/profile" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👤</span> Mon Profil
            </a>
            <a routerLink="/catalog" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📚</span> Catalogue
            </a>
          </div>
        }

        @if (isAdmin()) {
          <div class="nav-section">
            <span class="nav-section-title">Administration</span>
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📊</span> Dashboard
            </a>
            <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👥</span> Utilisateurs
            </a>
            <a routerLink="/admin/formations" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🎓</span> Formations
            </a>
            <a routerLink="/catalog" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📚</span> Catalogue
            </a>
          </div>
        }
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ initials() }}</div>
          <div class="user-details">
            <span class="user-name">{{ fullName() }}</span>
            <span class="user-email">{{ email() }}</span>
          </div>
        </div>
        <button class="btn-logout" (click)="logout()">Déconnexion</button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0; top: 0; bottom: 0;
      width: var(--sidebar-width);
      background: linear-gradient(180deg, #12122b 0%, #1a1a3e 100%);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      z-index: 100;
      overflow-y: auto;
    }

    .sidebar-brand {
      padding: 24px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border);
    }

    .brand-icon { font-size: 2rem; }
    .brand-text { display: flex; flex-direction: column; }
    .brand-name { font-size: 1.1rem; font-weight: 800; background: linear-gradient(135deg, #818cf8, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .brand-role { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }

    .sidebar-nav { flex: 1; padding: 16px 12px; }

    .nav-section { margin-bottom: 24px; }
    .nav-section-title {
      display: block;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--text-muted);
      padding: 0 12px;
      margin-bottom: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
      transition: var(--transition);
      margin-bottom: 2px;
      text-decoration: none;
    }

    .nav-item:hover { background: rgba(255,255,255,0.07); color: var(--text-primary); }

    .nav-item.active {
      background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15));
      color: var(--primary-light);
      border-left: 2px solid var(--primary);
    }

    .nav-icon { font-size: 1.1rem; width: 20px; text-align: center; }

    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--border);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .user-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .user-details { display: flex; flex-direction: column; overflow: hidden; }
    .user-name { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-email { font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .btn-logout {
      width: 100%;
      padding: 8px;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(239,68,68,0.3);
      background: rgba(239,68,68,0.08);
      color: #f87171;
      cursor: pointer;
      font-size: 0.8rem;
      font-family: 'Inter', sans-serif;
      transition: var(--transition);
    }
    .btn-logout:hover { background: rgba(239,68,68,0.2); }
  `]
})
export class SidebarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  isAdmin = computed(() => this.authService.isAdmin());
  initials = computed(() => {
    const u = this.authService.currentUser();
    return u ? (u.firstName[0] + u.lastName[0]).toUpperCase() : '?';
  });
  fullName = computed(() => {
    const u = this.authService.currentUser();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });
  email = computed(() => this.authService.currentUser()?.email ?? '');

  logout() { this.authService.logout(); }
}
