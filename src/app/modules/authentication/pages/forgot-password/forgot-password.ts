import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PasswordResetService } from '../../services/password-reset/password-reset.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { timer } from 'rxjs';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, RouterModule, NotificationComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.message = '';
      this.error = '';

      const email = this.forgotPasswordForm.value.email;

      this.passwordResetService.requestPasswordReset(email).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notificationService.success(
            'Email envoyé', 
            'Un email de réinitialisation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.'
          );
          timer(2000).subscribe(() => {
            this.router.navigate(['/auth/sign-in']);
          });
        },
        error: (error) => {
          this.isLoading = false;
          let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
          
          if (error.status === 400) {
            errorMessage = 'Adresse email invalide. Veuillez vérifier votre email et réessayer.';
          } else if (error.status === 404) {
            errorMessage = 'Aucun compte associé à cette adresse email. Veuillez vérifier votre email ou créer un nouveau compte.';
          } else if (error.status === 0 || error.status === 500) {
            errorMessage = 'Problème de connexion au serveur. Veuillez réessayer plus tard.';
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.notificationService.error(
            'Erreur de réinitialisation', 
            errorMessage
          );
        }
      });
    } else {
      this.markFormGroupTouched();
      this.showValidationErrors();
    }
  }

  private showValidationErrors() {
    const emailControl = this.forgotPasswordForm.get('email');
    
    if (emailControl?.errors?.['required']) {
      this.notificationService.error(
        'Champ requis', 
        'Veuillez renseigner votre adresse email'
      );
    } else if (emailControl?.errors?.['email']) {
      this.notificationService.error(
        'Format invalide', 
        'Veuillez entrer une adresse email valide (exemple: utilisateur@email.com)'
      );
    }
  }

  onCancel() {
    this.router.navigate(['/auth/sign-in']);
  }

  private markFormGroupTouched() {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters pour faciliter l'accès aux contrôles du formulaire
  get email() {
    return this.forgotPasswordForm.get('email');
  }
}