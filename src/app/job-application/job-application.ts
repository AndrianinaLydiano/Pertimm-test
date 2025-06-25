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
  startTime: number | null = null;

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
          this.startTime = Date.now();
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
    if (!this.confirmationUrl || !this.startTime) return;
    this.loading = true;

    const now = Date.now();
    const elapsedSeconds = (now - this.startTime) / 1000;

    if (elapsedSeconds > 30) {
      this.toastr.error(
        'Temps écoulé. La confirmation doit se faire dans les 30 secondes.'
      );
      this.resetForm();
      return;
    }

    this.jobService.confirmApplication(this.confirmationUrl).subscribe({
      next: () => {
        this.toastr.success('Candidature confirmée avec succès !');
        this.resetForm();
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Erreur lors de la confirmation de la candidature');
      },
    });
  }

  resetForm() {
    this.email = '';
    this.first_name = '';
    this.last_name = '';
    this.loading = false;
    this.polling = false;
    this.confirmationUrl = undefined;
  }
}
