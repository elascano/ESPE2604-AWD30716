import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

declare global {
  interface Window {
    google?: any;
    onGoogleLibraryLoad?: () => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signals for modern Angular state management
  public readonly currentUser = signal<GoogleUser | null>(null);
  public readonly isAuthenticated = signal<boolean>(false);
  public readonly isGsiLoaded = signal<boolean>(false);
  
  // Default Client ID (users can replace this, or we fallback gracefully)
  private readonly GOOGLE_CLIENT_ID = '666385811487-kvjqk4pcuosst5ssu5cq4s2sgh9c0io1.apps.googleusercontent.com';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.restoreSession();
      this.loadGoogleIdentityServices();
    }
  }

  /**
   * Restores user session from localStorage if it exists
   */
  private restoreSession(): void {
    try {
      const storedUser = localStorage.getItem('spotify_clone_user');
      if (storedUser) {
        const user = JSON.parse(storedUser) as GoogleUser;
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      }
    } catch (e) {
      console.error('Error restoring session:', e);
      localStorage.removeItem('spotify_clone_user');
    }
  }

  /**
   * Dynamically loads the Google Identity Services script
   */
  private loadGoogleIdentityServices(): void {
    if (typeof window === 'undefined') return;

    if (window.google?.accounts?.id) {
      this.isGsiLoaded.set(true);
      this.initializeGoogleSDK();
      return;
    }

    // Set callback for when script is loaded
    window.onGoogleLibraryLoad = () => {
      this.isGsiLoaded.set(true);
      this.initializeGoogleSDK();
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.isGsiLoaded.set(true);
      this.initializeGoogleSDK();
    };
    script.onerror = () => {
      console.warn('Failed to load Google Identity Services. Using high-fidelity simulator fallback.');
    };
    document.head.appendChild(script);
  }

  /**
   * Initializes the Google SDK with Client ID and callback
   */
  private initializeGoogleSDK(): void {
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: this.GOOGLE_CLIENT_ID,
          callback: (response: any) => this.handleCredentialResponse(response),
          auto_select: false,
          cancel_on_tap_outside: true
        });
      }
    } catch (err) {
      console.error('Error initializing Google SDK:', err);
    }
  }

  /**
   * Renders the official Google button in the specified HTML element
   */
  public renderGoogleButton(element: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Retry checking if GIS is ready
    const checkAndRender = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.renderButton(element, {
          type: 'standard',
          theme: 'filled_blue',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: element.clientWidth || 250
        });
      } else {
        setTimeout(checkAndRender, 200);
      }
    };
    
    checkAndRender();
  }

  /**
   * Decode JWT token received from Google OAuth2 callback
   */
  private handleCredentialResponse(response: any): void {
    try {
      const payload = this.decodeJwt(response.credential);
      const user: GoogleUser = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };

      this.loginUser(user);
    } catch (error) {
      console.error('Failed to parse Google credentials:', error);
    }
  }

  /**
   * Helper to decode JWT token
   */
  private decodeJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  /**
   * Successful login handler
   */
  public loginUser(user: GoogleUser): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    
    // Save to local storage for persistent session
    localStorage.setItem('spotify_clone_user', JSON.stringify(user));
    // Clear any previous session expiration markers
    localStorage.removeItem('spotify_session_expired');
    
    // Navigate to dashboard
    this.router.navigate(['/dashboard']);
  }

  /**
   * Logs out the user and flags the session as expired
   * so that unauthorized accesses know they were recently logged in.
   */
  public logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    
    // Clear session storage but set session-expired flag in localStorage
    localStorage.removeItem('spotify_clone_user');
    localStorage.setItem('spotify_session_expired', 'true');

    // Revoke Google OAuth token if active
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch (e) {
      console.warn('Could not disable auto select:', e);
    }

    // Redirect to the login component directly
    this.router.navigate(['/login']);
  }

  /**
   * Triggers a beautiful simulated Google OAuth flow for testing/fallback
   */
  public loginWithSimulator(): Promise<void> {
    return new Promise((resolve) => {
      // Setup beautiful mock users to rotate
      const mockUsers: GoogleUser[] = [
        {
          id: 'mock_1029384756',
          name: 'Brayan Gualotuña',
          email: 'brayan.gualotuna@gmail.com',
          picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 'mock_9876543210',
          name: 'Usuario Invitado',
          email: 'invitado.spotify@gmail.com',
          picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
        }
      ];

      // Simulate network request
      setTimeout(() => {
        // Pick first mock user (Brayan)
        const user = mockUsers[0];
        this.loginUser(user);
        resolve();
      }, 1200);
    });
  }

  /**
   * Check if a session was recently expired/logged out
   */
  public checkSessionExpiredState(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return localStorage.getItem('spotify_session_expired') === 'true';
  }

  /**
   * Clear the session expired flag
   */
  public clearSessionExpiredState(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('spotify_session_expired');
  }
}
