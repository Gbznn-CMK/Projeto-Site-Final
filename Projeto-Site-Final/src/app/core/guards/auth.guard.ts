import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { UserType } from '../models/user';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = route.data['roles'] as UserType[] | undefined;
  const userType = auth.currentUser()?.tipoUsuario;
  if (allowedRoles && userType && !allowedRoles.includes(userType)) {
    return router.createUrlTree([userType === 'prestador' ? '/home-prestador' : '/home-cliente']);
  }

  return true;
};
