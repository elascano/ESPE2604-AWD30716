import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // User is not authenticated. 
  // We flag the session as expired/unauthorized so the countdown page knows to render
  localStorage.setItem('spotify_session_expired', 'true');
  
  // Redirect to the specialized 5-second countdown page
  router.navigate(['/session-expired']);
  return false;
};
