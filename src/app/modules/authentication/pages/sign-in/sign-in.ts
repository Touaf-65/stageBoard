import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LoginResponse, UserService } from '../../services/user/user.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { timer } from 'rxjs';
import { apiErrorMessage } from '../../../../shared/utils/api-error';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  imports: [CommonModule, FormsModule, SvgIconComponent, ButtonComponent, NotificationComponent, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn implements OnInit {

  email: string = '';
  password: string = '';
  submitted = false;
  loading = false;
  passwordTextType!: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    ) {
  }

  ngOnInit() {
    // Session précédente terminée sans renaviguer : on est déjà en train d'ouvrir cette page
    this.userService.endSession();
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted = true;

  }

  login_user() {
    this.loading = true;
    const observer = {
      next: (data: LoginResponse) => {
        this.userService.startSession(data);
        this.notificationService.success(
          'Connexion réussie',
          `Bienvenue, ${data.email} !`
        );
        timer(2000).subscribe(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (error: any) => {
        this.loading = false;
        this.notificationService.error(
          'Erreur de connexion', 
          apiErrorMessage(error, 'Identifiants incorrects ou problème de connexion', { email: 'Email', password: 'Mot de passe' })
        );
      }
    };
    this.userService.login({ email: this.email, password: this.password }).subscribe(observer);
  }

  get f() {
    return;
  }

}
