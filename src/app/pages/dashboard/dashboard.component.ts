// src/app/pages/dashboard/dashboard.component.ts

import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import videojs from 'video.js';
import { VideoApi } from '../../services/video-api';

/* ────────── Typen ────────── */
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
  safeSrc?: SafeResourceUrl;
}

interface SrcObj {
  src: string;
  type: string;
  label: string;
}

/* ────────── Component ────────── */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  /* Datencontainer */
  categories: Category[] = [];
  videos: Video[] = [];
  featuredVideo!: Video;

  /* Detail-Overlay */
  active: Video | null = null;
  currentSources: SrcObj[] = [];
  chosenSrc = '';

  @ViewChild('videoPlayer', { static: false })
  videoElement!: ElementRef<HTMLVideoElement>;
  private player: any;  // <- hier als any

  constructor(
    private api: VideoApi,
    private sanitizer: DomSanitizer
  ) {}

  /* ---------- Lifecycle ---------- */
  ngOnInit(): void {
    this.api.getCategories().subscribe(cats => {
      console.log('📂 Kategorien:', cats);
      this.categories = cats;
    });

    this.api.getVideos().subscribe(vids => {
      console.log('🎬 Videos:', vids);
      this.videos = vids.map(v => ({
        ...v,
        safeSrc: this.sanitizer.bypassSecurityTrustResourceUrl(v.file),
      }));

      this.featuredVideo =
        this.videos.find(v => this.displayCategory(v.category) === 'Anime')
        || this.videos[0];
      console.log('⭐ featuredVideo:', this.featuredVideo);
    });
  }

  ngOnDestroy(): void {
    this.player?.dispose();
  }

  /* ---------- Öffnen / Schließen ---------- */
  open(video: Video): void {
    this.active = video;
    this.currentSources = this.getQualitySources(video);
    this.chosenSrc = this.currentSources[0].src;

    setTimeout(() => {
      this.player?.dispose();

      this.player = videojs(this.videoElement.nativeElement, {
        controls: true,
        preload: 'auto',
        fluid: true,
        sources: [{ src: this.chosenSrc, type: 'video/mp4' }],
      });

      // Wenn ein Format nicht lädt, automatisch nächste Qualität wählen
      this.player.on('error', () => {
        const idx = this.currentSources.findIndex(s => s.src === this.chosenSrc);
        const next = this.currentSources[idx + 1];
        if (next) {
          this.chosenSrc = next.src;
          this.player.src({ src: this.chosenSrc, type: next.type });
          this.player.play();
        }
      });

      // Fokus für ESC
      (document.querySelector('.overlay') as HTMLElement)?.focus();
    });
  }

  onOverlayClick(evt: MouseEvent): void {
    if (
      evt.target &&
      (evt.target as HTMLElement).classList.contains('overlay')
    ) {
      this.close();
    }
  }

  close(): void {
    this.active = null;
    this.player?.dispose();
    this.player = undefined;
  }

  /* ---------- Qualität wechseln ---------- */
  onQualityChange(newSrc: string): void {
    if (!this.player || newSrc === this.chosenSrc) return;

    this.chosenSrc = newSrc;
    this.player.src({ src: this.chosenSrc, type: 'video/mp4' });
    this.player.play();
  }

  /* ---------- Hotkey ---------- */
  @HostListener('window:keydown.escape')
  esc(): void {
    if (this.active) this.close();
  }

  /* ---------- Helfer ---------- */
  displayCategory(cat: Category | number): string {
    return typeof cat === 'object'
      ? cat.name
      : this.categories.find(c => c.id === cat)?.name ?? '';
  }

  videosByCategory(catId: number): Video[] {
    return this.videos.filter(v =>
      typeof v.category === 'object'
        ? v.category.id === catId
        : v.category === catId
    );
  }

  private getQualitySources(video: Video): SrcObj[] {
    return [
      { src: video.file.replace('.mp4', '_1080p.mp4'), type: 'video/mp4', label: '1080p' },
      { src: video.file.replace('.mp4', '_720p.mp4'),  type: 'video/mp4', label: '720p'  },
      { src: video.file.replace('.mp4', '_360p.mp4'),  type: 'video/mp4', label: '360p'  },
      { src: video.file.replace('.mp4', '_120p.mp4'),  type: 'video/mp4', label: '120p'  },
      { src: video.file,                               type: 'video/mp4', label: 'Original' },
    ];
  }
}
