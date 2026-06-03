import { Component, AfterViewInit, ElementRef, ViewChild, signal, inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('googleButtonContainer') googleButtonContainer!: ElementRef<HTMLDivElement>;

  // UI state signals
  public readonly isLoading = signal<boolean>(false);
  public readonly loadingText = signal<string>('Conectando con Google...');
  public readonly showClientSetupHint = signal<boolean>(false);

  private authService = inject(AuthService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Attempt to render official Google Sign-In button
      this.renderOfficialGoogleButton();
    }
  }

  private renderOfficialGoogleButton(): void {
    if (this.googleButtonContainer) {
      this.authService.renderGoogleButton(this.googleButtonContainer.nativeElement);
    }
  }

  /**
   * Triggers the beautiful simulated Google login flow
   */
  public async onLoginWithSimulator(): Promise<void> {
    if (this.isLoading()) return;
    
    this.isLoading.set(true);
    this.loadingText.set('Abriendo cuenta de Google...');
    
    // Step 1: Simulate the Google Popup loading
    setTimeout(async () => {
      this.loadingText.set('Autenticando credenciales...');
      
      try {
        // Step 2: Invoke simulation login
        await this.authService.loginWithSimulator();
      } catch (error) {
        console.error('Simulation login failed:', error);
        this.isLoading.set(false);
      }
    }, 800);
  }

  public toggleClientSetupHint(): void {
    this.showClientSetupHint.set(!this.showClientSetupHint());
  }
}
