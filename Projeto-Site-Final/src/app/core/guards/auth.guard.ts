import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { getLocalStorage } from '../utils/storage';
import { StorageKeys } from '../utils/storage-keys';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Simple check: a stored token indicates an authenticated session.
  const token = getLocalStorage()?.getItem(StorageKeys.TOKEN);

  if (token) {
    return true;
  }

  // Redirect to login if not authenticated
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
