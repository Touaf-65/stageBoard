import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { EcheanceModel, EcheanceService } from '../../services/echeance/echeance.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { apiErrorMessage } from '../../../../shared/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { DateRange, clampDate, echeanceRange, todayIso } from '../../../../shared/utils/date';
import { ProfileModel, ProfileService } from '../../services/profile/profile.service';

type Statut = EcheanceModel['statut'];

const FIELD_LABELS: Record<string, string> = {
  title: 'Titre',
  description: 'Description',
  due_date: 'Date limite',
  statut: 'Statut',
};

@Component({
  standalone: true,
  selector: 'app-echeance',
  imports: [CommonModule, ModalComponent, FormsModule, NotificationComponent, IconComponent],
  templateUrl: './echeance.html',
  styleUrl: './echeance.scss',
})
export class Echeance implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private echeanceService: EcheanceService,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) { }

  // Dates du stage, pour borner les champs de date comme le fait l'API
  profile: ProfileModel | null = null;

  get createRange(): DateRange {
    return echeanceRange(this.profile?.date_debut, this.profile?.date_fin);
  }

  get editRange(): DateRange {
    return echeanceRange(this.profile?.date_debut, this.profile?.date_fin, this.echeanceToEdit?.date_limite);
  }

  titre: string = '';
  description: string = '';
  date_limite: string = todayIso();
  statut: 'A venir' | 'Fait' | 'En retard' = 'A venir';

  echeances: EcheanceModel[] = [];

  filteredEcheances: EcheanceModel[] = [];
  activeTab: Statut | 'Toutes' = 'Toutes';


  ngOnInit(): void {
    this.loadEcheances();
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.cdr.detectChanges();
      }
    });
  }

  loadEcheances(): void {
    this.echeanceService.getEcheances().subscribe({
      next: (data) => {
        this.echeances = data;
        this.filteredEcheances = data;
        this.applyTabFilter();
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: Statut | 'Toutes'): void {
    this.activeTab = tab;
    this.applyTabFilter();
  }

  applyTabFilter(): void {
    if (this.activeTab === 'Toutes') {
      this.filteredEcheances = [...this.echeances];
    } else {
      this.filteredEcheances = this.echeances.filter(e => e.statut === this.activeTab);
    }
  }


  createEcheance(): void {
    const echeanceload = {
      title: this.titre,
      description: this.description,
      due_date: this.date_limite,
      statut: this.statut
    };
    this.echeanceService.createEcheance(echeanceload).subscribe({
      next: (data) => {
        this.notificationService.success('Échéance créée', 'La nouvelle échéance a été créée avec succès.');
        this.loadEcheances();
        this.modalCreateOpen = false;
      },
      // La modale reste ouverte pour corriger la saisie
      error: (error) => {
        this.notificationService.error('Erreur', apiErrorMessage(error, 'Une erreur est survenue lors de la création de l\'échéance.', FIELD_LABELS));
      }

    })
  }


  // ===== CREATE =====
  modalCreateOpen = false;
  // Formulaire vierge à chaque ouverture : la date part d'aujourd'hui, ramenée dans les bornes du stage
  openModalCreateEcheance() {
    this.titre = '';
    this.description = '';
    this.date_limite = clampDate(todayIso(), this.createRange);
    this.statut = 'A venir';
    this.modalCreateOpen = true;
  }

  closeModalCreateEcheance() {
    this.modalCreateOpen = false;
  }



  // Fin Modal create

  // ===== EDIT =====
  echeanceToEdit: EcheanceModel | null = null;
  editDate: string = todayIso();
  editTitre: string = '';
  editDescription: string = '';
  editStatut: 'A venir' | 'Fait' | 'En retard' = 'A venir';
  modalEditOpen = false;

  openEdit(echeance: EcheanceModel) {
    this.modalEditOpen = true;
    this.echeanceToEdit = echeance;
    this.editTitre = echeance.titre;
    this.editDescription = echeance.description ?? '';
    this.editDate = echeance.date_limite;
    this.editStatut = echeance.statut;
  }

  closeModalEditEcheance() {
    this.modalEditOpen = false;
    this.echeanceToEdit = null;
    this.editTitre = '';
    this.editDescription = '';
    this.editDate = todayIso();
    this.editStatut = 'A venir';
  }

  EditEcheance(): void {
    const payload = {
      title: this.editTitre,
      description: this.editDescription,
      due_date: this.editDate,
      statut: this.editStatut
    };
    this.echeanceService.updateEcheance(this.echeanceToEdit!.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Échéance modifiée', 'L\'échéance a été modifiée avec succès.');
        this.loadEcheances();
        this.closeModalEditEcheance();
      },
      // La modale reste ouverte pour corriger la saisie
      error: (error) => {
        this.notificationService.error('Erreur', apiErrorMessage(error, 'Une erreur est survenue lors de la modification de l\'échéance.', FIELD_LABELS));
      }
    })
  }

  // ===== DELETE =====
  modalDeleteOpen = false;
  echeanceToDelete: EcheanceModel | null = null;
  deleteError = '';

  openDelete(echeance: EcheanceModel) {
    this.modalDeleteOpen = true;
    this.echeanceToDelete = echeance;
    this.deleteError = '';
  }

  closeModalDeleteEcheance() {
    this.modalDeleteOpen = false;
    this.echeanceToDelete = null;
    this.deleteError = '';
  }

  deleteEcheance(): void {
    this.echeanceService.deleteEcheance(this.echeanceToDelete!.id).subscribe({
      next: () => {
        this.notificationService.success('Échéance supprimée', "L'échéance a été supprimée avec succès.");
        this.loadEcheances();
        this.closeModalDeleteEcheance();
      },
      error: (error) => {
        this.notificationService.error('Erreur', apiErrorMessage(error, 'Une erreur est survenue lors de la suppression de l\'échéance.'));
        this.closeModalDeleteEcheance();
      }
    });
  }



  menuOpen = false;
  selectedEcheance: EcheanceModel | null = null;

  // Menu rattaché à la ligne (sous le bouton ⋮, aligné à droite) : il suit le défilement
  // et ne sort plus de l'écran comme lorsqu'il était ouvert au point du clic
  openMenu(event: MouseEvent, e: EcheanceModel) {
    event.stopPropagation();
    const alreadyOpen = this.menuOpen && this.selectedEcheance?.id === e.id;
    this.selectedEcheance = e;
    this.menuOpen = !alreadyOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onEditFromMenu() {
    this.closeMenu();
    if (this.selectedEcheance) this.openEdit(this.selectedEcheance);
  }

  onDeleteFromMenu() {
    this.closeMenu();
    if (this.selectedEcheance) this.openDelete(this.selectedEcheance);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
  }

  // ===== Affichage =====
  readonly tabs: { value: Statut | 'Toutes'; label: string }[] = [
    { value: 'Toutes', label: 'Toutes' },
    { value: 'A venir', label: 'À venir' },
    { value: 'Fait', label: 'Terminées' },
    { value: 'En retard', label: 'En retard' },
  ];

  // Libellé affiché (la valeur stockée par l'API reste 'A venir' / 'Fait' / 'En retard')
  statutLabel(statut: Statut): string {
    return { 'A venir': 'À venir', 'Fait': 'Terminée', 'En retard': 'En retard' }[statut] ?? statut;
  }

  statutBadge(statut: Statut): string {
    return { 'A venir': 'badge-info', 'Fait': 'badge-success', 'En retard': 'badge-danger' }[statut] ?? 'badge-neutral';
  }

  tabCount(tab: Statut | 'Toutes'): number {
    return tab === 'Toutes' ? this.echeances.length : this.echeances.filter(e => e.statut === tab).length;
  }
}