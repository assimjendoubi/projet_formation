import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
      </div>

      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-logo">✨</div>
            <h1>Créer un compte</h1>
            <p>Rejoignez notre plateforme de formation</p>
          </div>

          @if (error) {
            <div class="alert alert-danger">{{ error }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="grid-2">
              <div class="form-group">
                <label for="firstName">Prénom</label>
                <input id="firstName" type="text" class="form-control"
                       [class.input-error]="isInvalid('firstName')"
                       formControlName="firstName" placeholder="Jean" />
                @if (isInvalid('firstName')) {
                  <span class="form-error">Prénom requis</span>
                }
              </div>
              <div class="form-group">
                <label for="lastName">Nom</label>
                <input id="lastName" type="text" class="form-control"
                       [class.input-error]="isInvalid('lastName')"
                       formControlName="lastName" placeholder="Dupont" />
                @if (isInvalid('lastName')) {
                  <span class="form-error">Nom requis</span>
                }
              </div>
            </div>

            <div class="form-group">
              <label for="email">Adresse email</label>
              <input id="email" type="email" class="form-control"
                     [class.input-error]="isInvalid('email')"
                     formControlName="email" placeholder="vous@example.com" />
              @if (isInvalid('email')) {
                <span class="form-error">Email valide requis</span>
              }
            </div>

            <div class="form-group">
              <label for="phone">Téléphone (optionnel)</label>
              <input id="phone" type="tel" class="form-control"
                     formControlName="phone" placeholder="0612345678" />
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input id="password" type="password" class="form-control"
                     [class.input-error]="isInvalid('password')"
                     formControlName="password" placeholder="Minimum 6 caractères" />
              @if (isInvalid('password')) {
                <span class="form-error">6 caractères minimum</span>
              }
            </div>

            <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
              @if (loading) { <span class="spinner-sm"></span> Création... }
              @else { 🚀 Créer mon compte }
            </button>
          </form>

          <p class="auth-footer">
            Déjà un compte ? <a routerLink="/login">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .auth-bg { position: fixed; inset: 0; pointer-events: none; }
    .bg-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; }
    .orb-1 { width: 400px; height: 400px; background: #8b5cf6; top: -10%; right: -10%; }
    .orb-2 { width: 350px; height: 350px; background: #06b6d4; bottom: -5%; left: -5%; }
    .auth-container { position: relative; z-index: 1; width: 100%; max-width: 480px; padding: 20px; }
    .auth-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.12); border-radius: 28px; padding: 40px; box-shadow: 0 25px 80px rgba(0,0,0,0.5); }
    .auth-header { text-align: center; margin-bottom: 28px; }
    .auth-logo { font-size: 2.5rem; margin-bottom: 12px; }
    .auth-header h1 { font-size: 1.6rem; font-weight: 800; margin-bottom: 8px; }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
    .auth-footer { text-align: center; margin-top: 20px; color: var(--text-secondary); font-size: 0.875rem; }
    .auth-footer a { color: var(--primary-light); font-weight: 500; }
    .spinner-sm { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading = false;
        if (err.error?.message) {
          this.error = err.error.message;
        } else if (err.error && typeof err.error === 'object') {
          const firstVal = Object.values(err.error)[0];
          this.error = typeof firstVal === 'string' ? firstVal : 'Erreur lors de l\'inscription';
        } else if (err.status === 0) {
          this.error = 'Impossible de contacter le serveur backend (vérifiez que Spring Boot est démarré sur le port 8080)';
        } else {
          this.error = 'Erreur lors de l\'inscription';
        }
      }
    });
  }

  isInvalid(field: string) { const c = this.form.get(field); return c?.invalid && c?.touched; }
}
