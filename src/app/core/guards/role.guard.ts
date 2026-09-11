import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { TipoUsuario } from '../models/types';

export const roleGuard = (allowedRoles: TipoUsuario[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getUserRole();

    if (!userRole) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    // Redirect to home if user doesn't have required role
    router.navigate(['/']);
    return false;
  };
};
