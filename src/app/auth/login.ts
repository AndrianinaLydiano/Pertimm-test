import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr'
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  email: string = '';
  password: string = '';

  onSubmit() {
    if (!this.email || !this.password) {
      this.toastr.error('Veuillez remplir tous les champs.');
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.toastr.success(`Bienvenue ${this.email}`, 'Success');
        this.router.navigate(['/job-application']);
      },
      error: (error) => {
        if (error.status === 401) {
          this.toastr.error('Identifiants incorrects, veuillez réessayer.', 'Error');
        } else {
          this.toastr.error('Erreur lors du login: ' + error.message, 'Error');
        }
      }
    });
  }
}
