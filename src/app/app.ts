import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';

// La protection des pages est assurée par authGuard (routes du layout) :
// l'ancienne vérification du token ici faisait doublon et lisait le localStorage
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ResponsiveHelperComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('stageBoard');
}
