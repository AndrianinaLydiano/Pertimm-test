import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  email = '';
  password1 = '';
  password2 = '';

  onSubmit() {
    if (!this.email || !this.password1 || !this.password2) {
      this.toastr.error('Veuillez remplir tous les champs.');
      return;
    }

    this.authService.register({ email: this.email, password1: this.password1, password2: this.password2 }).subscribe({
      next: () => {
        this.toastr.info('Inscription réussie, vous pouvez maintenant vous connecter.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const message = err?.error?.message || 'Erreur inconnue';
        this.toastr.error(`Erreur lors de l’inscription : ${message}`);
      },
    });
  }

}
