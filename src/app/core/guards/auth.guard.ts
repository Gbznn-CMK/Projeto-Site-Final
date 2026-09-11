import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { getLocalStorage } from '../utils/storage';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated();
  
  // Use a simple check - if there's a token in localStorage
  const token = getLocalStorage()?.getItem('nahora_token');
  
  if (token) {
    return true;
  }

  // Redirect to login if not authenticated
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
