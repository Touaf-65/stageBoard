import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { EcheanceModel } from '../../services/echeance/echeance.service';
import { JournalModel, JournalService } from '../../services/journal/journal.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-journal',
  imports: [CommonModule, ModalComponent, NotificationComponent, FormsModule],
  templateUrl: './journal.html',
  styleUrl: './journal.scss',
})
export class Journal implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private journalService: JournalService,
    private cdr: ChangeDetectorRef
  ) { }
  titre: string = '';
  description: string = '';
  date_entree: Date = new Date()
  competences: string = '';
  difficultes: string = '';
  taches: string = '';

  journals: JournalModel[] = [];


  ngOnInit() {
    this.loadJournals();
  }

  loadJournals(): void {
    const token = localStorage.getItem('authToken');
    this.journalService.getJournals().subscribe({
      next: (data) => {
        console.log('📋 Journals rechargés:', data); // ← Ajoute ça

        this.journals = data;
        this.cdr.detectChanges();
      }
    });
  }

  createJournal(): void {
    const journalload = {
      titre: this.titre,
      description: this.description,
      date_entree: this.date_entree,
      competences: this.competences,
      difficultes: this.difficultes,
      taches: this.taches,
    };
    this.journalService.createJournal(journalload).subscribe({
      next: (data) => {
        this.notificationService.success('Journal créé', 'Le nouveau journal a été créé avec succès!');
        this.titre = '';
        this.description = '';
        this.date_entree = new Date();
        this.competences = '';
        this.difficultes = '';
        this.taches = '',
          this.loadJournals();
        this.modalCreateOpen = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la création du journal.');
        this.modalCreateOpen = false;
      }
    });
  }

  modalViewOpen = false;

  selectedJournal: JournalModel | null = null;

  // ==== CREATE ====
  modalCreateOpen = false;

  openModalCreateJournal() {
    this.modalCreateOpen = true;
  }

  closeModalCreateJournal() {
    this.modalCreateOpen = false;
  }

  // ==== EDIT ====
  journalToEdit: JournalModel | null = null;
  editTitre: string = '';
  editDescription: string = '';
  editDate: Date = new Date();
  editCompetences: string = '';
  editDifficultes: string = '';
  editTaches: string = '';
  modalEditOpen = false;

  openModalEditJournal(journal: JournalModel) {
    this.journalToEdit = journal;
    this.editTitre = journal.titre;
    this.editDescription = journal.description;
    this.editDate = journal.date_entree;
    this.editCompetences = journal.competences;
    this.editDifficultes = journal.difficultes;
    this.editTaches = journal.taches;
    this.modalEditOpen = true;
  }

  closeModalEditJournal() {
    this.modalEditOpen = false;
    this.journalToEdit = null;
    this.editTitre = '';
    this.editDescription = '';
    this.editDate = new Date();
    this.editCompetences = '';
    this.editDifficultes = '';
    this.editTaches = ''
  }

  editJournal(): void {
    if (!this.selectedJournal) return;
    const journal = this.selectedJournal;
    this.closeView();
    this.openModalEditJournal(journal);
  }

  saveEditJournal(): void {
    if (!this.journalToEdit) return;

    const payload = {
      titre: this.editTitre,
      description: this.editDescription,
      date_entree: this.editDate,
      competences: this.editCompetences,
      difficultes: this.editDifficultes,
      taches: this.editTaches,
    };

    this.journalService.updateJournal(this.journalToEdit.id, payload).subscribe({
      next: () => {
        this.loadJournals();
        this.notificationService.success('Journal modifié', 'Le journal a été modifié avec succès!');
        this.closeModalEditJournal();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la modification du journal.');
        this.closeModalEditJournal();
      }
    });
  }

  deleteJournal(): void {
    if (!this.selectedJournal) return;

    this.journalService.deleteJournal(this.selectedJournal!.id).subscribe({
      next: () => {
        this.notificationService.success('Journal supprimé', 'Le journal a été supprimé avec succès!');
        this.loadJournals();
        this.closeView();
      },
      error: () => {
        this.notificationService.error('Erreur', 'Une erreur est survenue lors de la suppression du journal.');
        this.closeView();
      }
    });
  }


  openView(j: any) {
    this.selectedJournal = j;
    this.modalViewOpen = true;
  }

  closeView() {
    this.modalViewOpen = false;
    this.selectedJournal = null;
  }
}

