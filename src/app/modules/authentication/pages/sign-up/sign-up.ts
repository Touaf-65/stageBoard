import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { UserService } from '../../user/user.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { timer } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-sign-up',
  imports: [CommonModule, RouterModule, FormsModule, SvgIconComponent, ButtonComponent, NotificationComponent],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp implements OnInit {
  email = '';
  password = '';
  confirmPassword = '';
  submitted = false;
  loading = false;
  passwordTextType = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    // Component initialization
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted = true;

    if (!this.email || !this.password || !this.confirmPassword) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.notificationService.error(
        'Erreur de validation',
        'Les mots de passe ne correspondent pas',
      );
      return;
    }

    this.register_user();
  }

  register_user() {
    this.loading = true;

    this.userService.register({ email: this.email, password: this.password }).subscribe({
      next: (data: any) => {
        this.notificationService.success(
          'Inscription réussie',
          'Votre compte a été créé avec succès!',
        );

        timer(1500).subscribe(() => {
          this.router.navigate(['/auth/sign-in']);
        });
      },
      error: (error: any) => {
        this.loading = false;
        this.notificationService.error(
          'Erreur d\'inscription',
          error.error?.msg || error.error?.message || 'Une erreur est survenue lors de l\'inscription',
        );
      },
    });
  }
}
