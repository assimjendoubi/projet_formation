import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
        <div class="bg-orb orb-3"></div>
      </div>

      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-logo">🎓</div>
            <h1>Bienvenue</h1>
            <p>Connectez-vous à votre espace de formation</p>
          </div>

          @if (error) {
            <div class="alert alert-danger">{{ error }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="email">Adresse email</label>
              <input id="email" type="email" class="form-control"
                     [class.input-error]="isInvalid('email')"
                     formControlName="email" placeholder="vous@example.com" />
              @if (isInvalid('email')) {
                <span class="form-error">Email invalide</span>
              }
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <div class="password-wrapper">
                <input id="password" [type]="showPassword ? 'text' : 'password'"
                       class="form-control" [class.input-error]="isInvalid('password')"
                       formControlName="password" placeholder="••••••••" />
                <button type="button" class="password-toggle" (click)="showPassword = !showPassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              @if (isInvalid('password')) {
                <span class="form-error">Mot de passe requis</span>
              }
            </div>

            <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
              @if (loading) { <span class="spinner-sm"></span> Connexion... }
              @else { 🔐 Se connecter }
            </button>
          </form>

          <p class="auth-footer">
            Pas encore de compte ? <a routerLink="/register">Créer un compte</a>
          </p>

          <div class="test-accounts">
            <p class="test-title">Comptes de test :</p>
            <div class="test-btns">
              <button class="test-btn" (click)="fillAdmin()">👑 Admin</button>
              <button class="test-btn" (click)="fillLearner()">🎓 Apprenant</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .auth-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
    }

    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
    }
    .orb-1 { width: 400px; height: 400px; background: #6366f1; top: -10%; left: -10%; }
    .orb-2 { width: 350px; height: 350px; background: #8b5cf6; bottom: -5%; right: -5%; }
    .orb-3 { width: 250px; height: 250px; background: #06b6d4; top: 40%; left: 40%; }

    .auth-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
      padding: 20px;
    }

    .auth-card {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 28px;
      padding: 40px;
      box-shadow: 0 25px 80px rgba(0,0,0,0.5);
    }

    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-logo { font-size: 3rem; margin-bottom: 16px; }
    .auth-header h1 { font-size: 1.75rem; font-weight: 800; margin-bottom: 8px; }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }

    .password-wrapper { position: relative; }
    .password-toggle {
      position: absolute; right: 12px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none;
      cursor: pointer; font-size: 1rem;
      padding: 4px;
    }

    .auth-footer { text-align: center; margin-top: 20px; color: var(--text-secondary); font-size: 0.875rem; }
    .auth-footer a { color: var(--primary-light); font-weight: 500; }
    .auth-footer a:hover { color: var(--primary); }

    .test-accounts {
      margin-top: 20px;
      padding: 12px 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
    }
    .test-title { font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-bottom: 8px; }
    .test-btns { display: flex; gap: 8px; }
    .test-btn {
      flex: 1; padding: 8px; border-radius: 8px; border: 1px solid var(--border);
      background: rgba(255,255,255,0.05); color: var(--text-secondary);
      cursor: pointer; font-size: 0.8rem; transition: var(--transition);
      font-family: 'Inter', sans-serif;
    }
    .test-btn:hover { background: rgba(99,102,241,0.15); color: var(--primary-light); }

    .spinner-sm {
      display: inline-block;
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.authService.login(this.form.value).subscribe({
      next: res => {
        this.loading = false;
        this.router.navigate([res.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard']);
      },
      error: err => {
        this.loading = false;
        if (err.error?.message) {
          this.error = err.error.message;
        } else if (err.status === 0) {
          this.error = 'Impossible de contacter le serveur backend (vérifiez que Spring Boot est démarré sur le port 8080)';
        } else {
          this.error = 'Email ou mot de passe incorrect';
        }
      }
    });
  }

  isInvalid(field: string) {
    const c = this.form.get(field);
    return c?.invalid && c?.touched;
  }

  fillAdmin() { this.form.patchValue({ email: 'admin@training.com', password: 'Admin@123' }); }
  fillLearner() { this.form.patchValue({ email: 'alice@training.com', password: 'Learner@123' }); }
}
