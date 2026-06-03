import { Component, OnInit, OnDestroy, signal, computed, inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService, GoogleUser } from '../../services/auth.service';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string; // e.g. "3:45"
  durationSec: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  
  // Expose current user from auth service
  public readonly user = computed<GoogleUser | null>(() => this.authService.currentUser());
  
  public readonly userFirstName = computed<string>(() => {
    const name = this.user()?.name;
    return name ? name.split(' ')[0] : 'Usuario';
  });
  
  // UI State Signals
  public readonly greeting = signal<string>('¡Hola!');
  public readonly isPlaying = signal<boolean>(false);
  public readonly currentProgress = signal<number>(0); // in seconds
  public readonly currentVolume = signal<number>(50); // 0-100
  public readonly isMuted = signal<boolean>(false);
  public readonly isProfileDropdownOpen = signal<boolean>(false);

  // Music state signals
  public readonly activeTrack = signal<Track | null>(null);

  // Playback timer interval
  private playbackInterval: any;

  // Mock Spotify playlists
  public readonly playlists = signal<string[]>([
    'Descubrimiento Semanal',
    'Radar de Novedades',
    'Éxitos México',
    'Chilled Beats 🎧',
    'Coding & Focus 💻',
    'Lo-Fi Coding Sessions',
    'Rock Classics 🎸',
    'Mega Hits 2026'
  ]);

  // Mock Track data
  public readonly tracks = signal<Track[]>([
    {
      id: 'track_1',
      title: 'Starboy',
      artist: 'The Weeknd, Daft Punk',
      album: 'Starboy',
      coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&h=150&fit=crop',
      duration: '3:50',
      durationSec: 230
    },
    {
      id: 'track_2',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=150&fit=crop',
      duration: '3:20',
      durationSec: 200
    },
    {
      id: 'track_3',
      title: 'Lose Yourself',
      artist: 'Eminem',
      album: '8 Mile',
      coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150&h=150&fit=crop',
      duration: '5:26',
      durationSec: 326
    },
    {
      id: 'track_4',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&h=150&fit=crop',
      duration: '3:53',
      durationSec: 233
    },
    {
      id: 'track_5',
      title: 'Stressed Out',
      artist: 'Twenty One Pilots',
      album: 'Blurryface',
      coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&h=150&fit=crop',
      duration: '3:22',
      durationSec: 202
    },
    {
      id: 'track_6',
      title: 'Bad Guy',
      artist: 'Billie Eilish',
      album: 'When We All Fall Asleep',
      coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150&h=150&fit=crop',
      duration: '3:14',
      durationSec: 194
    }
  ]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.calculateGreeting();
      // Set the first track as default
      if (this.tracks().length > 0) {
        this.activeTrack.set(this.tracks()[0]);
      }
    }
  }

  ngOnDestroy(): void {
    this.clearPlaybackTimer();
  }

  private calculateGreeting(): void {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      this.greeting.set('¡Buenos días');
    } else if (hour >= 12 && hour < 19) {
      this.greeting.set('¡Buenas tardes');
    } else {
      this.greeting.set('¡Buenas noches');
    }
  }

  /**
   * Toggles the main music playback
   */
  public togglePlay(): void {
    if (this.isPlaying()) {
      this.isPlaying.set(false);
      this.clearPlaybackTimer();
    } else {
      this.isPlaying.set(true);
      this.startPlaybackTimer();
    }
  }

  /**
   * Selects a track and plays it immediately
   */
  public selectTrack(track: Track): void {
    this.activeTrack.set(track);
    this.currentProgress.set(0);
    this.isPlaying.set(true);
    this.startPlaybackTimer();
  }

  /**
   * Custom format for track progression e.g. "0:45"
   */
  public formatTime(sec: number): string {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  /**
   * Get percentage value of progression for the slider width
   */
  public getProgressPercent(): number {
    const total = this.activeTrack()?.durationSec || 100;
    return (this.currentProgress() / total) * 100;
  }

  /**
   * Handles user dragging progress bar
   */
  public onProgressChange(event: any): void {
    const value = +event.target.value;
    this.currentProgress.set(value);
  }

  /**
   * Handles user changing volume slider
   */
  public onVolumeChange(event: any): void {
    const value = +event.target.value;
    this.currentVolume.set(value);
    if (value > 0) {
      this.isMuted.set(false);
    }
  }

  /**
   * Mute / Unmute audio
   */
  public toggleMute(): void {
    this.isMuted.set(!this.isMuted());
  }

  /**
   * Toggles profile menu dropdown visibility
   */
  public toggleProfileDropdown(event: Event): void {
    event.stopPropagation();
    this.isProfileDropdownOpen.set(!this.isProfileDropdownOpen());
  }

  /**
   * Closes profile menu dropdown
   */
  public closeProfileDropdown(): void {
    this.isProfileDropdownOpen.set(false);
  }

  /**
   * Revoke session and log out
   */
  public onLogout(): void {
    this.clearPlaybackTimer();
    this.authService.logout();
  }

  /* Playback progression timer logic */
  private startPlaybackTimer(): void {
    this.clearPlaybackTimer();
    this.playbackInterval = setInterval(() => {
      const track = this.activeTrack();
      if (!track) return;
      
      const current = this.currentProgress();
      if (current >= track.durationSec) {
        // Track finished, loop to beginning
        this.currentProgress.set(0);
      } else {
        this.currentProgress.set(current + 1);
      }
    }, 1000);
  }

  private clearPlaybackTimer(): void {
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
    }
  }
}
