import { Routes } from '@angular/router';
import { Login } from './auth/login';
import { Register } from './auth/register';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];
