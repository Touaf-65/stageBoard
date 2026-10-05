import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EntrepriseService, EntrepriseModel, EntrepriseRequest } from '../../services/entreprise/entreprise.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { apiErrorMessage } from '../../../../shared/utils/api-error';

const FIELD_LABELS: Record<string, string> = {
  nom: "Nom de l'entreprise",
  secteur: "Secteur d'activité",
  adresse: 'Adresse',
  telephone: 'Téléphone',
  email_tuteur: 'Email du tuteur',
  nom_tuteur: 'Nom du tuteur',
};

@Component({
  standalone: true,
  selector: 'app-entreprise',
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './entreprise.html',
  styleUrl: './entreprise.scss',
})
export class Entreprise implements OnInit {

  entreprise: EntrepriseModel | null = null;
  loading = true;
  saving = false;
  isEditing = false;

  form: EntrepriseRequest = this.emptyForm();

  // Initiales du tuteur pour l'avatar
  get initiales(): string {
    if (!this.entreprise?.nom_tuteur) return '??';
    return this.entreprise.nom_tuteur
      .split(' ')
      .filter(n => n)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  constructor(
    private entrepriseService: EntrepriseService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getEntreprise();
  }

  getEntreprise(): void {
    this.entrepriseService.getEntreprise().subscribe({
      next: (data) => {
        this.entreprise = data?.id ? data : null;
        this.loading = false;
        this.cdr.detectChanges();
      },
      // 404 = aucune fiche entreprise pour cet utilisateur
      error: () => {
        this.entreprise = null;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openEdit(): void {
    this.form = this.entreprise
      ? {
          nom: this.entreprise.nom,
          secteur: this.entreprise.secteur ?? '',
          adresse: this.entreprise.adresse ?? '',
          telephone: this.entreprise.telephone ?? '',
          email_tuteur: this.entreprise.email_tuteur ?? '',
          nom_tuteur: this.entreprise.nom_tuteur ?? '',
        }
      : this.emptyForm();
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEntreprise(): void {
    if (!this.form.nom.trim()) {
      this.notificationService.error('Champ obligatoire', "Le nom de l'entreprise est obligatoire.");
      return;
    }

    this.saving = true;
    const payload: EntrepriseRequest = {
      nom: this.form.nom.trim(),
      secteur: this.form.secteur?.trim() ?? '',
      adresse: this.form.adresse?.trim() ?? '',
      telephone: this.form.telephone?.trim() ?? '',
      email_tuteur: this.form.email_tuteur?.trim() ?? '',
      nom_tuteur: this.form.nom_tuteur?.trim() ?? '',
    };

    const request$ = this.entreprise
      ? this.entrepriseService.updateEntreprise(this.entreprise.id, payload)
      : this.entrepriseService.createEntreprise(payload);

    request$.subscribe({
      next: () => {
        this.notificationService.success(
          'Entreprise enregistrée',
          'Les informations de votre entreprise ont été enregistrées.'
        );
        this.saving = false;
        this.isEditing = false;
        this.getEntreprise();
      },
      error: (error: HttpErrorResponse) => {
        this.saving = false;
        this.notificationService.error(
          'Erreur',
          apiErrorMessage(error, "Une erreur est survenue lors de l'enregistrement.", FIELD_LABELS)
        );
        this.cdr.detectChanges();
      }
    });
  }

  private emptyForm(): EntrepriseRequest {
    return { nom: '', secteur: '', adresse: '', telephone: '', email_tuteur: '', nom_tuteur: '' };
  }
}
