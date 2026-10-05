import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProfileModel, ProfileService } from '../../services/profile/profile.service';
import { EcheanceModel, EcheanceService } from '../../services/echeance/echeance.service';
import { JournalModel, JournalService } from '../../services/journal/journal.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { stageProgress } from '../../../../shared/utils/date';

@Component({
  standalone: true,
  selector: 'app-vue',
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './vue.html',
  styleUrl: './vue.scss',
})
export class Vue implements OnInit {

  profile: ProfileModel | null = null;
  echeances: EcheanceModel[] = [];
  journals: JournalModel[] = [];
  loading = true;

  constructor(
    private profileService: ProfileService,
    private echeanceService: EcheanceService,
    private journalService: JournalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    forkJoin({
      profile: this.profileService.getProfile().pipe(catchError(() => of(null))),
      echeances: this.echeanceService.getEcheances().pipe(catchError(() => of([]))),
      journals: this.journalService.getJournals().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ profile, echeances, journals }) => {
        this.profile = profile;
        this.echeances = echeances ?? [];
        this.journals = journals ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ===== Jours restants =====
  get joursRestants(): number {
    return stageProgress(this.profile?.date_debut, this.profile?.date_fin).joursRestants;
  }

  // ===== Progression stage =====
  get progressionStage(): number {
    return stageProgress(this.profile?.date_debut, this.profile?.date_fin).pourcentage;
  }

  // ===== Prochaine échéance =====
  get prochaineEcheance(): EcheanceModel | null {
    const today = new Date();
    const aVenir = this.echeances
      .filter(e => e.statut === 'A venir' && new Date(e.date_limite) >= today)
      .sort((a, b) => new Date(a.date_limite).getTime() - new Date(b.date_limite).getTime());
    return aVenir[0] ?? null;
  }

  get joursAvantEcheance(): number {
    if (!this.prochaineEcheance) return 0;
    const diff = Math.ceil(
      (new Date(this.prochaineEcheance.date_limite).getTime() - new Date().getTime())
      / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, diff);
  }

  get badgeEcheanceClass(): string {
    const j = this.joursAvantEcheance;
    if (j <= 2) return 'badge-danger';
    if (j <= 7) return 'badge-warning';
    return 'badge-success';
  }

  // "Aujourd'hui", "Demain", "Dans 5 jours" (au lieu de "Dans 0 jours" / "Dans 1 jours")
  get delaiEcheanceLabel(): string {
    const j = this.joursAvantEcheance;
    if (j === 0) return "Aujourd'hui";
    if (j === 1) return 'Demain';
    return `Dans ${j} jours`;
  }

  // ===== Échéances en attente =====
  get echeancesEnAttente(): number {
    return this.echeances.filter(e => e.statut === 'A venir').length;
  }

  // ===== Dernier journal =====
  get dernierJournal(): JournalModel | null {
    if (!this.journals.length) return null;
    return [...this.journals]
      .sort((a, b) => new Date(b.date_entree).getTime() - new Date(a.date_entree).getTime())[0];
  }
}
