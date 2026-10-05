import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';

import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset/password-reset.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';

import { timer } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-new-password',
  imports: [CommonModule, RouterModule, NotificationComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './new-password.html',
  styleUrl: './new-password.scss',
})
export class NewPassword implements OnInit {

  newPasswordForm: FormGroup;
  isLoading = false;
  message = '';
  error = '';
  token = '';
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = 0;

  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.newPasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.notificationService.error(
        'Token invalide',
        'Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.'
      );
      timer(3000).subscribe(() => {
        this.router.navigate(['/auth/forgot-password']);
      });
    }

    this.newPasswordForm.get('password')?.valueChanges.subscribe(value => {
      this.passwordStrength = this.calculatePasswordStrength(value);
    });
  }

  onSubmit() {
    if (this.newPasswordForm.valid && this.token) {
      this.isLoading = true;
      this.message = '';
      this.error = '';

      const new_password = this.newPasswordForm.value.password;
      const confirmPassword = this.newPasswordForm.value.confirmPassword;

      this.passwordResetService.confirmPasswordReset(this.token, new_password, confirmPassword).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notificationService.success(
            'Mot de passe réinitialisé',
            'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.'
          );
          timer(2000).subscribe(() => {
            this.router.navigate(['/auth/sign-in']);
          });
        },
        error: (error) => {
          this.isLoading = false;
          
          if (error.status === 400 && error.error?.msg) {
            // ✅ Message direct du backend (token expiré, etc.)
            this.notificationService.error('Lien invalide', error.error.msg);
            timer(3000).subscribe(() => {
              this.router.navigate(['/auth/forgot-password']);
            });
            return;
          }
          let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';

          if (error.status === 400) {
            if (error.error?.password) {
              errorMessage = 'Le mot de passe ne respecte pas les critères de sécurité. Veuillez choisir un mot de passe plus fort.';
            } else if (error.error?.token) {
              errorMessage = 'Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.';
            } else {
              errorMessage = 'Données invalides. Veuillez vérifier vos informations et réessayer.';
            }
          } else if (error.status === 404) {
            errorMessage = 'Lien de réinitialisation introuvable. Veuillez demander un nouveau lien.';
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
    const passwordControl = this.newPasswordForm.get('password');
    const confirmPasswordControl = this.newPasswordForm.get('confirmPassword');

    if (passwordControl?.errors?.['required']) {
      this.notificationService.error(
        'Champ requis',
        'Veuillez entrer votre nouveau mot de passe'
      );
    } else if (passwordControl?.errors?.['minlength']) {
      this.notificationService.error(
        'Mot de passe trop court',
        'Le mot de passe doit contenir au moins 8 caractères'
      );
    } else if (passwordControl?.errors?.['passwordRequirements']) {
      this.notificationService.error(
        'Critères non respectés',
        'Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial'
      );
    } else if (confirmPasswordControl?.errors?.['required']) {
      this.notificationService.error(
        'Champ requis',
        'Veuillez confirmer votre nouveau mot de passe'
      );
    } else if (this.newPasswordForm.errors?.['passwordMismatch']) {
      this.notificationService.error(
        'Mots de passe différents',
        'Les mots de passe ne correspondent pas. Veuillez les saisir à nouveau.'
      );
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private calculatePasswordStrength(password: string): number {
    if (!password) return 0;

    let strength = 0;

    // Longueur
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Contient des minuscules
    if (/[a-z]/.test(password)) strength++;

    // Contient des majuscules
    if (/[A-Z]/.test(password)) strength++;

    // Contient des chiffres
    if (/\d/.test(password)) strength++;

    // Contient des caractères spéciaux
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    return Math.min(strength, 4);
  }

  getPasswordStrengthColor(): string {
    switch (this.passwordStrength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-muted';
    }
  }

  private passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    if (!password) return null;

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^a-zA-Z\d]/.test(password);

    if (!hasLetter || !hasNumber || !hasSpecial) {
      return { 'passwordRequirements': true };
    }

    return null;
  }

  private passwordMatchValidator(form: AbstractControl): { [key: string]: any } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }

    return null;
  }

  private markFormGroupTouched() {
    Object.keys(this.newPasswordForm.controls).forEach(key => {
      const control = this.newPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters pour faciliter l'accès aux contrôles du formulaire
  get password() {
    return this.newPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.newPasswordForm.get('confirmPassword');
  }
}