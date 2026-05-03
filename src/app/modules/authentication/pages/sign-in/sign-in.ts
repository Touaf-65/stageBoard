import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { UserService } from '../../user/user.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';
import { timer } from 'rxjs';

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
    this.userService.logout();
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
      next: (data: any) => {
        this.loading = true;
        this.userService.setAccesToken(data);
        this.userService.getConnectedUserByEmail(this.email).subscribe(user => {
            this.userService.setConnectedUser(user);
            this.notificationService.success(
              'Connexion réussie',
              'Bienvenue, ${user.email || "utilisateur"} !'
            );
            timer(2000).subscribe(() => {
              this.router.navigate(['/dashboard']);
            });
          });
      },
      error: (error: any) => {
        this.loading = false;
        this.notificationService.error(
          'Erreur de connexion', 
          error.error?.message || 'Identifiants incorrects ou problème de connexion'
        );
      }
    };
    this.userService.login({ email: this.email, password: this.password }).subscribe(observer);
  }

  get f() {
    return;
  }

}
