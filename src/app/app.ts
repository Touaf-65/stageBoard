import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationStart } from '@angular/router';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { filter } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ResponsiveHelperComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('stageBoard');
  private jwtHelper = new JwtHelperService();

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: any) => {
      const token = localStorage.getItem('authToken');
      const isAuthRoute = event.url.startsWith('/auth');
      
      if ((!token || this.jwtHelper.isTokenExpired(token)) && !isAuthRoute) {
        this.router.navigate(['/auth/sign-in']);
      }
    });
  }
}
