import { Routes } from '@angular/router';
import { Login } from './auth/login';
import { Register } from './auth/register';
import { JobApplication } from './job-application/job-application';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'job-application', component: JobApplication },
];
