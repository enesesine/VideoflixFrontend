import {
  Component,
  OnInit,
  HostListener,
} from '@angular/core';
import {
  CommonModule,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  DomSanitizer,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { VideoApi } from '../../services/video-api';

/* ────────── Interfaces ────────── */
interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Video {
  id: number;
  title: string;
  description: string;
  file: string;
  thumbnail: string | null;
  category: Category | number;
  created_at: string;
  length?: number; // Minuten (optional)
  /* wird erst im Frontend erzeugt */
  safeSrc?: SafeResourceUrl;
}

/* ────────── Component ────────── */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  /* Daten-Container */
  categories: Category[] = [];
  videos: Video[] = [];

  /* aktuell geöffnetes Detail-Overlay */
  active: Video | null = null;

  constructor(
    private api: VideoApi,
    private sanitizer: DomSanitizer
  ) {}

  /* ────────── Lifecycle ────────── */
  ngOnInit(): void {
    /* Kategorien laden */
    this.api.getCategories().subscribe((cats) => {
      this.categories = cats;
    });

    /* Videos laden & URL absichern */
    this.api.getVideos().subscribe((vids) => {
      this.videos = vids.map((v) => ({
        ...v,
        safeSrc: this.sanitizer.bypassSecurityTrustResourceUrl(
          v.file
        ),
      }));
    });
  }

  /* ────────── Overlay-Steuerung ────────── */
  open(video: Video): void {
    this.active = video;

    /* Overlay erhält Fokus → Escape funktioniert */
    setTimeout(() => {
      const el = document.querySelector('.overlay') as HTMLElement;
      el?.focus();
    });
  }

  close(): void {
    this.active = null;
  }

  /** Escape-Taste schließt Overlay */
  @HostListener('window:keydown.escape')
  esc(): void {
    if (this.active) this.close();
  }

  /** Kategorie-Namen zuverlässig anzeigen */
  displayCategory(cat: Category | number): string {
    return typeof cat === 'object'
      ? cat.name
      : this.categories.find((c) => c.id === cat)?.name ?? '';
  }

  /** Genre-Filter für jede Reihe */
  videosByCategory(catId: number): Video[] {
    return this.videos.filter((v) =>
      typeof v.category === 'object'
        ? v.category.id === catId
        : v.category === catId
    );
  }

  /** (Optional) Voll-Play-Routing */
  playFull(video: Video): void {
    console.log('Play full movie', video.id);
    /* z. B.  this.router.navigate(['/watch', video.id]); */
  }
}
