import { Component, OnInit, OnDestroy, signal, inject, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-session-expired',
  standalone: true,
  imports: [],
  templateUrl: './session-expired.html',
  styleUrl: './session-expired.css',
})
export class SessionExpiredComponent implements OnInit, OnDestroy {
  public readonly timeLeft = signal<number>(5);
  public readonly progressStrokeDashoffset = signal<number>(0);
  
  private countdownInterval: any;
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Ensure the expired flag is active
      if (!this.authService.checkSessionExpiredState()) {
        // If they just navigated here directly for no reason, redirect to login
        this.router.navigate(['/login']);
        return;
      }

      this.startCountdown();
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown(): void {
    // 2 * PI * R where R = 45 -> Circumference = ~282.7
    const circumference = 2 * Math.PI * 45;
    
    this.countdownInterval = setInterval(() => {
      const current = this.timeLeft();
      if (current <= 1) {
        clearInterval(this.countdownInterval);
        this.authService.clearSessionExpiredState();
        this.router.navigate(['/login']);
      } else {
        this.timeLeft.set(current - 1);
        // Update circular progress offset
        const elapsed = 5 - (current - 1);
        const offset = (elapsed / 5) * circumference;
        this.progressStrokeDashoffset.set(offset);
      }
    }, 1000);
  }
}
