import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileService, ProfileModel } from '../../services/profile/profile.service'
import { EntrepriseService } from '../../services/entreprise/entreprise.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { UserService } from '../../../authentication/services/user/user.service';
import { apiErrorMessage, isAuthError } from '../../../../shared/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const FIELD_LABELS: Record<string, string> = {
  nom: 'Nom',
  prenom: 'Prénom',
  email: 'Email',
  filiere: 'Filière',
  annee: 'Année',
  type_stage: 'Type de stage',
  date_debut: 'Date de début',
  date_fin: 'Date de fin',
};

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, NotificationComponent, RouterLink, IconComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  constructor(
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private userService: UserService,
    private entrepriseService: EntrepriseService,
    private cdr: ChangeDetectorRef
  ) {}


  profile: ProfileModel | null = null;
  loading = true;
  saving = false;
  isEditing = false;

  showIncompleteAlert = false;
  missingProfile = false;
  missingEntreprise = false;


  nom: string = '';
  prenom: string = '';
  email: string = '';
  filiere: string = '';
  annee: string = '';
  type_stage: string = '';
  date_debut: string = '';
  date_fin: string = '';


  get isProfileComplete(): boolean {
    return this.profileService.isProfileComplete(this.profile);
  }

  get initiales(): string {
    if (!this.profile) return '??';
    return `${this.profile.prenom?.[0] || ''}${this.profile.nom?.[0] || ''}`.toUpperCase();
  }

  ngOnInit() {
    this.loadProfile();
    this.checkEntreprise();
  }


  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.fillFields(data);
        this.loading = false;
        this.syncConnectedUser(data);
        this.updateIncompleteAlert();
      },
      error: (error) => {
        this.loading = false;
        if (isAuthError(error)) return; // session expirée : gérée par l'intercepteur
        this.notificationService.error('Erreur', apiErrorMessage(error, 'Impossible de charger le profil'));
        this.cdr.detectChanges();
      }
    });
  }

  // Seule une 404 signifie "aucune entreprise" ; une autre erreur ne permet pas de conclure
  checkEntreprise(): void {
    this.entrepriseService.getEntreprise().subscribe({
      next: (data) => {
        this.missingEntreprise = !data?.id;
        this.updateIncompleteAlert();
      },
      error: (error) => {
        this.missingEntreprise = error.status === 404;
        this.updateIncompleteAlert();
      }
    });
  }

  private syncConnectedUser(p: ProfileModel): void {
    this.userService.setConnectedUser({ id: p.id, email: p.email, nom: p.nom, prenom: p.prenom });
  }

  // L'alerte reflète l'état réel, pas les paramètres de l'URL (qui deviennent obsolètes)
  private updateIncompleteAlert(): void {
    this.missingProfile = !!this.profile && !this.isProfileComplete;
    this.showIncompleteAlert = this.missingProfile || this.missingEntreprise;
    this.cdr.detectChanges();
  }


  fillFields(p: ProfileModel): void {
    this.nom = p.nom || '';
    this.prenom = p.prenom || '';
    this.email = p.email || '';
    this.filiere = p.filiere || '';
    this.annee = p.annee || '';
    this.type_stage = p.type_stage || '';
    this.date_debut = p.date_debut || '';
    this.date_fin = p.date_fin || '';
  }

  openEdit(): void {
    this.isEditing = true;
    if (this.profile) this.fillFields(this.profile);
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (this.profile) this.fillFields(this.profile);
  }


  saveProfile(): void {
    this.saving = true;

    const payload = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      filiere: this.filiere,
      annee: this.annee,
      type_stage: this.type_stage,
      date_debut: this.date_debut,
      date_fin: this.date_fin
    };

    this.profileService.updateProfile(payload).subscribe({
      next: (data) => {
        this.profile = data;
        this.isEditing = false;
        this.saving = false;
        this.showIncompleteAlert = false;

        // Garde le nom et l'email affichés dans la navbar à jour
        this.syncConnectedUser(data);

        this.notificationService.success(
          'Profil mis à jour',
          'Vos informations ont été enregistrées.'
        );

        this.loadProfile();

        this.cdr.detectChanges();
      },
      error: (error) => {
        this.saving = false;
        this.notificationService.error(
          'Erreur',
          apiErrorMessage(error, 'Une erreur est survenue lors de la mise à jour.', FIELD_LABELS)
        );
        this.cdr.detectChanges();
      }
    });
  }
}