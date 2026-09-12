import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { UserService } from '../../core/services/user.service';
import { ProfilService } from '../../core/services/profil.service';
import { CompetenceService } from '../../core/services/competence.service';
import { User, Profil, Competence, CompetenceLevel } from '../../core/models/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <div class="main-content">
        <div class="page-content">
          <div class="page-header">
            <h1>Mon <span class="gradient-text">Profil</span></h1>
            <p>Gérez vos informations personnelles et compétences</p>
          </div>

          @if (successMsg) { <div class="alert alert-success">{{ successMsg }}</div> }
          @if (errorMsg) { <div class="alert alert-danger">{{ errorMsg }}</div> }

          <div class="profile-grid">
            <!-- Personal Info -->
            <div class="card">
              <div class="card-header">
                <h3>Informations Personnelles</h3>
              </div>
              <div class="card-body">
                <form [formGroup]="userForm" (ngSubmit)="saveUser()">
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
                    <label>Email</label>
                    <input type="email" class="form-control" formControlName="email" readonly style="opacity: 0.6;" />
                  </div>
                  <div class="form-group">
                    <label>Téléphone</label>
                    <input type="tel" class="form-control" formControlName="phone" placeholder="0612345678" />
                  </div>
                  <button type="submit" class="btn btn-primary" [disabled]="savingUser">
                    {{ savingUser ? 'Sauvegarde...' : '💾 Sauvegarder' }}
                  </button>
                </form>
              </div>
            </div>

            <!-- Profile Details -->
            <div class="card">
              <div class="card-header"><h3>Détails du Profil</h3></div>
              <div class="card-body">
                <form [formGroup]="profilForm" (ngSubmit)="saveProfil()">
                  <div class="form-group">
                    <label>Biographie</label>
                    <textarea class="form-control" formControlName="bio" placeholder="Parlez de vous..." rows="3"></textarea>
                  </div>
                  <div class="form-group">
                    <label>Adresse</label>
                    <input type="text" class="form-control" formControlName="address" placeholder="Ville, Pays" />
                  </div>
                  <div class="form-group">
                    <label>Date de naissance</label>
                    <input type="date" class="form-control" formControlName="dateOfBirth" />
                  </div>
                  <button type="submit" class="btn btn-primary" [disabled]="savingProfil">
                    {{ savingProfil ? 'Sauvegarde...' : '💾 Mettre à jour le profil' }}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Competencies -->
          <div class="card mt-6">
            <div class="card-header">
              <div class="flex items-center justify-between">
                <h3>Mes Compétences ({{ competences.length }})</h3>
              </div>
            </div>
            <div class="card-body">
              <!-- Add Form -->
              <form [formGroup]="competenceForm" (ngSubmit)="addCompetence()" class="add-comp-form">
                <input type="text" class="form-control" formControlName="name" placeholder="Nom de la compétence (ex: Java)" style="flex:1;" />
                <input type="text" class="form-control" formControlName="description" placeholder="Description (optionnel)" style="flex:1.5;" />
                <select class="form-control" formControlName="level" style="width: 160px;">
                  <option value="">Niveau...</option>
                  @for (l of levels; track l) { <option [value]="l">{{ l }}</option> }
                </select>
                <button type="submit" class="btn btn-primary btn-sm" [disabled]="competenceForm.invalid">+ Ajouter</button>
              </form>

              <!-- List -->
              <div class="competence-chips mt-4">
                @for (comp of competences; track comp.id) {
                  <div class="competence-chip">
                    <span>{{ comp.name }}</span>
                    @if (comp.description) { <span class="text-muted text-xs">· {{ comp.description }}</span> }
                    <span class="badge badge-primary" style="font-size: 0.65rem; padding: 2px 6px;">{{ comp.level }}</span>
                    <button (click)="deleteCompetence(comp.id)" title="Supprimer">✕</button>
                  </div>
                }
                @if (competences.length === 0) {
                  <p class="text-muted text-sm">Aucune compétence. Ajoutez-en une ci-dessus.</p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .add-comp-form { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
    @media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr; } .add-comp-form { flex-direction: column; } }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profil: Profil | null = null;
  competences: Competence[] = [];

  userForm: FormGroup;
  profilForm: FormGroup;
  competenceForm: FormGroup;

  savingUser = false;
  savingProfil = false;
  successMsg = '';
  errorMsg = '';

  levels: CompetenceLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private profilService: ProfilService,
    private competenceService: CompetenceService
  ) {
    this.userForm = this.fb.group({ firstName: ['', Validators.required], lastName: ['', Validators.required], email: [{ value: '', disabled: true }], phone: [''] });
    this.profilForm = this.fb.group({ bio: [''], address: [''], dateOfBirth: [''] });
    this.competenceForm = this.fb.group({ name: ['', Validators.required], description: [''], level: ['', Validators.required] });
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(u => { this.user = u; this.userForm.patchValue(u); });
    this.profilService.getMyProfile().subscribe({ next: p => { this.profil = p; this.profilForm.patchValue(p); }, error: () => {} });
    this.competenceService.getMyCompetences().subscribe(c => this.competences = c);
  }

  saveUser() {
    if (this.userForm.invalid) return;
    this.savingUser = true;
    this.userService.updateCurrentUser(this.userForm.value).subscribe({
      next: u => { this.user = u; this.savingUser = false; this.showSuccess('Informations mises à jour !'); },
      error: () => { this.savingUser = false; this.showError('Erreur lors de la mise à jour'); }
    });
  }

  saveProfil() {
    this.savingProfil = true;
    const data = this.profilForm.value;
    const req = this.profil ? this.profilService.updateMyProfile(data) : this.profilService.createMyProfile(data);
    req.subscribe({
      next: p => { this.profil = p; this.savingProfil = false; this.showSuccess('Profil mis à jour !'); },
      error: () => { this.savingProfil = false; this.showError('Erreur lors de la mise à jour du profil'); }
    });
  }

  addCompetence() {
    if (this.competenceForm.invalid) return;
    this.competenceService.addCompetence(this.competenceForm.value).subscribe({
      next: c => { this.competences.push(c); this.competenceForm.reset(); this.showSuccess('Compétence ajoutée !'); },
      error: () => this.showError('Erreur lors de l\'ajout')
    });
  }

  deleteCompetence(id: number) {
    this.competenceService.deleteCompetence(id).subscribe({
      next: () => { this.competences = this.competences.filter(c => c.id !== id); this.showSuccess('Compétence supprimée'); },
      error: () => this.showError('Erreur lors de la suppression')
    });
  }

  showSuccess(msg: string) { this.successMsg = msg; this.errorMsg = ''; setTimeout(() => this.successMsg = '', 3000); }
  showError(msg: string) { this.errorMsg = msg; this.successMsg = ''; setTimeout(() => this.errorMsg = '', 5000); }
}
