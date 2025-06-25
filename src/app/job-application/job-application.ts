import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobApplicationService } from './job-application.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-application.html',
  styleUrls: ['./job-application.css']
})
export class JobApplication {
  private jobService = inject(JobApplicationService);
  private toastr = inject(ToastrService);

  email = '';
  first_name = '';
  last_name = '';

  loading = false;
  polling = false;
  confirmationUrl: string | undefined = undefined;

  onSubmit() {
    if (!this.email || !this.first_name || !this.last_name) {
      this.toastr.error('Veuillez remplir tous les champs.');
      return;
    }

    this.loading = true;
    this.jobService.createApplication({
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name
    }).subscribe({
      next: (res) => {
        this.toastr.info('Demande envoyée, vérification en cours...');
        this.pollStatus(res.url);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error('Erreur lors de la création de la demande');
      }
    });
  }

  pollStatus(url: string) {
    this.polling = true;
    this.jobService.getStatusUntilCompleted(url).subscribe({
      next: (res) => {
        if (res.status === 'COMPLETED') {
          this.polling = false;
          this.loading = false;
          this.confirmationUrl = res.confirmation_url;
          this.toastr.success('Statut : COMPLETED — prêt à confirmer.');
        }
      },
      error: (err) => {
        this.polling = false;
        this.loading = false;
        this.toastr.error('Erreur durant la vérification du statut');
      }
    });
  }

  confirmApplication() {
    if (!this.confirmationUrl) return;
    this.loading = true;

    // todo: confirmApplication call and logic
  }
}
