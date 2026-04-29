import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { EcheanceModel, EcheanceService } from '../../services/echeance/echeance.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';

@Component({
  standalone: true,
  selector: 'app-echeance',
  imports: [CommonModule, ModalComponent, FormsModule, NotificationComponent],
  templateUrl: './echeance.html',
  styleUrl: './echeance.scss',
})
export class Echeance implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private echeanceService: EcheanceService,
    private cdr: ChangeDetectorRef
  ) { }

  titre: string = '';
  description: string = '';
  date_limite: Date = new Date();
  statut: 'A venir' | 'Fait' | 'En retard' = 'A venir';

  echeances: EcheanceModel[] = [];

  filteredEcheances: EcheanceModel[] = [];
  activeTab: 'Toutes' | 'A venir' | 'Fait' | 'En retard' = 'Toutes';

  // selected item
  selected: any = null;


  ngOnInit(): void {
    this.loadEcheances();
  }

  loadEcheances(): void {
    const token = localStorage.getItem('authToken');
    this.echeanceService.getEcheances().subscribe({
      next: (data) => {
        this.echeances = data;
        this.filteredEcheances = data;
        this.applyTabFilter();
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: 'Toutes' | 'A venir' | 'Fait' | 'En retard'): void {
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

  get countAvenir(): number {
    return this.echeances.filter(e => e.statut === 'A venir').length;
  }
  get countFait(): number {
    return this.echeances.filter(e => e.statut === 'Fait').length;
  }
  get countEnRetard(): number {
    return this.echeances.filter(e => e.statut === 'En retard').length;
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
        this.notificationService.success('Échéance créée', 'La nouvelle échéance a été créée avec succès!');
        this.titre = '';
        this.description = '';
        this.date_limite = new Date();
        this.statut = 'A venir';
        this.loadEcheances();
        this.modalCreateOpen = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la création de l\'échéance.');
        this.modalCreateOpen = false;
      }

    })
  }


  // ===== CREATE =====
  modalCreateOpen = false;
  openModalCreateEcheance() {
    this.modalCreateOpen = true;
  }

  closeModalCreateEcheance() {
    this.modalCreateOpen = false;
  }



  // Fin Modal create

  // ===== EDIT =====
  echeanceToEdit: EcheanceModel | null = null;
  editDate: Date = new Date();
  editTitre: string = '';
  editDescription: string = '';
  editStatut: 'A venir' | 'Fait' | 'En retard' = 'A venir';
  modalEditOpen = false;

  openEdit(echeance: EcheanceModel) {
    this.modalEditOpen = true;
    this.echeanceToEdit = echeance;
    this.editTitre = echeance.titre;
    this.editDescription = echeance.description;
    this.editDate = echeance.date_limite;
    this.editStatut = echeance.statut;
  }

  closeModalEditEcheance() {
    this.modalEditOpen = false;
    this.echeanceToEdit = null;
    this.editTitre = '';
    this.editDescription = '';
    this.editDate = new Date();
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
        this.notificationService.success('Échéance modifiée', 'L\'échéance a été modifiée avec succès!');
        this.loadEcheances();
        this.closeModalEditEcheance();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la modification de l\'échéance.');
        this.closeModalEditEcheance();
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
        this.notificationService.success('Echéance supprimée', "L'échéance a été supprimée avec succès!");
        this.loadEcheances();
        this.closeModalDeleteEcheance();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la suppression de l\'échéance.');
        this.closeModalDeleteEcheance();
      }
    });
  }

  closeDelete() {
    this.modalDeleteOpen = false;
  }


  menuOpen = false;
  selectedEcheance: any = null;
  menuPosition = { x: 0, y: 0 };




  openDeleteEcheance(e: any) {
    this.selectedEcheance = e;

    this.modalDeleteOpen = true;
  }
  openMenu(event: MouseEvent, e: any) {
    event.stopPropagation();

    this.selectedEcheance = e;

    this.menuOpen = true;

    this.menuPosition = {
      x: event.clientX,
      y: event.clientY
    };
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onEditFromMenu() {
    this.closeMenu();
    this.openEdit(this.selectedEcheance);
  }

  onDeleteFromMenu() {
    this.closeMenu();
    this.openDelete(this.selectedEcheance);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeMenu();
  }
}