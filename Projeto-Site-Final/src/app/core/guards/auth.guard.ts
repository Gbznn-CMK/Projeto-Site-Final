import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TipoUsuario } from '../models/types';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const userType = auth.getUserRole();

  if (!userType) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = route.data['roles'] as TipoUsuario[] | undefined;

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return router.createUrlTree([userType === 'prestador' ? '/home-prestador' : '/home-cliente']);
  }

  return true;
};
