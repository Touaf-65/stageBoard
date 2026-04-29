import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntrepriseService, EntrepriseModel } from '../../services/entreprise/entreprise.service';

@Component({
  standalone: true,
  selector: 'app-entreprise',
  imports: [CommonModule],
  templateUrl: './entreprise.html',
  styleUrl: './entreprise.scss',
})
export class Entreprise implements OnInit {

  entreprise: EntrepriseModel | null = null;
  loading = true;

  // Initiales du tuteur pour l'avatar
  get initiales(): string {
    if (!this.entreprise?.nom_tuteur) return '??';
    return this.entreprise.nom_tuteur
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  constructor(private entrepriseService: EntrepriseService) {}

  ngOnInit() {
    this.entrepriseService.getEntreprise().subscribe({
      next: (data) => {
        this.entreprise = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}