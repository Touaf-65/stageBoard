import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { JournalModel, JournalService } from '../../services/journal/journal.service';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { apiErrorMessage } from '../../../../shared/utils/api-error';
import { DateRange, clampDate, journalRange, todayIso } from '../../../../shared/utils/date';
import { ProfileModel, ProfileService } from '../../services/profile/profile.service';

const FIELD_LABELS: Record<string, string> = {
  titre: 'Titre',
  description: 'Description',
  date_entree: 'Date',
  taches: 'Tâches',
  competences: 'Compétences',
  difficultes: 'Difficultés',
};

@Component({
  standalone: true,
  selector: 'app-journal',
  imports: [CommonModule, ModalComponent, NotificationComponent, FormsModule, IconComponent],
  templateUrl: './journal.html',
  styleUrl: './journal.scss',
})
export class Journal implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private journalService: JournalService,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) { }

  // Dates du stage, pour borner les champs de date comme le fait l'API
  profile: ProfileModel | null = null;

  get dateRange(): DateRange {
    return journalRange(this.profile?.date_debut, this.profile?.date_fin);
  }

  titre: string = '';
  description: string = '';
  date_entree: string = todayIso();
  competences: string = '';
  difficultes: string = '';
  taches: string = '';

  journals: JournalModel[] = [];
  filteredJournals: JournalModel[] = [];

  // Filtres
  searchText: string = '';
  selectedPeriode: string = '';
  periodes: string[] = [];

  ngOnInit() {
    this.loadJournals();
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.cdr.detectChanges();
      }
    });
  }

  loadJournals(): void {
    this.journalService.getJournals().subscribe({
      next: (data) => {
        this.journals = data;
        this.filteredJournals = data;
        this.buildPeriodes();
        this.applyFilters();
        this.cdr.detectChanges();
      }
    });
  }

  // "mai 2026" à partir de "2026-05-12" (T00:00:00 : interprété en heure locale)
  private periodeLabel(j: JournalModel): string {
    return new Date(j.date_entree + 'T00:00:00')
      .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  buildPeriodes(): void {
    this.periodes = Array.from(new Set(this.journals.map(j => this.periodeLabel(j)))).sort();
  }

  applyFilters(): void {
    let result = [...this.journals];

    // Filtre recherche
    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      result = result.filter(j =>
        (j.titre ?? '').toLowerCase().includes(q) ||
        (j.description ?? '').toLowerCase().includes(q)
      );
    }

    // Filtre période
    if (this.selectedPeriode) {
      result = result.filter(j => this.periodeLabel(j) === this.selectedPeriode);
    }

    this.filteredJournals = result;
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedPeriode = '';
    this.applyFilters();
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
        this.notificationService.success('Entrée ajoutée', "L'entrée du journal a été ajoutée.");
        this.loadJournals();
        this.modalCreateOpen = false;
      },
      // La modale reste ouverte pour corriger la saisie
      error: (error) => {
        this.notificationService.error('Erreur', apiErrorMessage(error, 'Une erreur est survenue lors de la création du journal.', FIELD_LABELS));
      }
    });
  }

  modalViewOpen = false;

  selectedJournal: JournalModel | null = null;

  // ==== CREATE ====
  modalCreateOpen = false;

  // Formulaire vierge à chaque ouverture : la date part d'aujourd'hui, ramenée dans les bornes du stage
  openModalCreateJournal() {
    this.titre = '';
    this.description = '';
    this.date_entree = clampDate(todayIso(), this.dateRange);
    this.competences = '';
    this.difficultes = '';
    this.taches = '';
    this.modalCreateOpen = true;
  }

  closeModalCreateJournal() {
    this.modalCreateOpen = false;
  }

  // ==== EDIT ====
  journalToEdit: JournalModel | null = null;
  editTitre: string = '';
  editDescription: string = '';
  editDate: string = todayIso();
  editCompetences: string = '';
  editDifficultes: string = '';
  editTaches: string = '';
  modalEditOpen = false;

  openModalEditJournal(journal: JournalModel) {
    this.journalToEdit = journal;
    this.editTitre = journal.titre;
    this.editDescription = journal.description ?? '';
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
    this.editDate = todayIso();
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
        this.notificationService.success('Entrée modifiée', "L'entrée du journal a été modifiée.");
        this.closeModalEditJournal();
      },
      // La modale reste ouverte pour corriger la saisie
      error: (error) => {
        this.notificationService.error('Erreur', apiErrorMessage(error, 'Une erreur est survenue lors de la modification du journal.', FIELD_LABELS));
      }
    });
  }

  // ==== DELETE (avec confirmation, comme pour les échéances) ====
  modalDeleteOpen = false;
  journalToDelete: JournalModel | null = null;

  askDeleteJournal(): void {
    if (!this.selectedJournal) return;
    this.journalToDelete = this.selectedJournal;
    this.closeView();
    this.modalDeleteOpen = true;
  }

  closeModalDeleteJournal(): void {
    this.modalDeleteOpen = false;
    this.journalToDelete = null;
  }

  deleteJournal(): void {
    if (!this.journalToDelete) return;

    this.journalService.deleteJournal(this.journalToDelete.id).subscribe({
      next: () => {
        this.notificationService.success('Entrée supprimée', "L'entrée du journal a été supprimée.");
        this.loadJournals();
        this.closeModalDeleteJournal();
      },
      error: (error) => {
        this.notificationService.error('Erreur', apiErrorMessage(error, 'Une erreur est survenue lors de la suppression du journal.'));
        this.closeModalDeleteJournal();
        this.cdr.detectChanges();
      }
    });
  }


  openView(j: JournalModel) {
    this.selectedJournal = j;
    this.modalViewOpen = true;
  }

  closeView() {
    this.modalViewOpen = false;
    this.selectedJournal = null;
  }
}

