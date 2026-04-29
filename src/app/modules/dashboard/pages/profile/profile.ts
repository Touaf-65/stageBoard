import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProfileService, ProfileModel } from '../../services/profile/profile.service'
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  constructor(
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
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
    this.route.queryParams.subscribe(params => {
      if (params['incomplete']) {
        this.showIncompleteAlert = true;
        this.missingProfile = params['missingProfile'] === 'true';
        this.missingEntreprise = params['missingEntreprise'] === 'true';
      }
    });

    this.loadProfile();
  }


  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.fillFields(data);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Erreur', 'Impossible de charger le profil');
      }
    });
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

        this.notificationService.success(
          'Profil mis à jour',
          'Vos informations ont été enregistrées.'
        );

        this.loadProfile();

        this.cdr.detectChanges();
      },
      error: () => {
        this.saving = false;
        this.notificationService.error(
          'Erreur',
          'Une erreur est survenue lors de la mise à jour.'
        );
      }
    });
  }
}