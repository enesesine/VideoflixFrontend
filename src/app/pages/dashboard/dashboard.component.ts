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

/* Types */
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
  safeSrc?: SafeResourceUrl; // sanitized URL for binding
}

interface SrcObj {
  src: string;
  type: string;
  label: string; // shown in quality selector
}

/* Component */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  /* Data */
  categories: Category[] = [];
  videos: Video[] = [];
  featuredVideo!: Video;

  /* Overlay state */
  active: Video | null = null;
  currentSources: SrcObj[] = [];
  chosenSrc = '';

  @ViewChild('videoPlayer', { static: false })
  videoElement!: ElementRef<HTMLVideoElement>;
  private player: any | undefined; 

  constructor(
    private api: VideoApi,
    private sanitizer: DomSanitizer
  ) {}

  /* Lifecycle */
  ngOnInit(): void {
    // load categories
    this.api.getCategories().subscribe(cats => (this.categories = cats));

    // load videos + pick featured
    this.api.getVideos().subscribe(vids => {
      this.videos = vids.map(v => ({
        ...v,
        safeSrc: this.sanitizer.bypassSecurityTrustResourceUrl(v.file),
      }));
      this.featuredVideo =
        this.videos.find(v => this.displayCategory(v.category) === 'Anime') ||
        this.videos[0];
    });
  }

  ngOnDestroy(): void {
    this.player?.dispose();
  }

  /* Overlay handlers */
  open(video: Video): void {
    // Dispose any existing player immediately
    if (this.player) {
      this.player.dispose();
      this.player = undefined;
    }

    // set new active video & sources
    this.active = video;
    this.currentSources = this.getQualitySources(video);
    this.chosenSrc = this.currentSources[0]?.src || '';

    // wait for the DOM to render the <video> tag inside *ngIf
    setTimeout(() => {
      // guard: no sources at all?
      if (!this.chosenSrc) {
        console.warn('No video sources found for', video);
        return;
      }
      // guard: make sure the element exists
      const el = this.videoElement?.nativeElement;
      if (!el) {
        console.error('Video element not found in DOM');
        return;
      }

      // initialize Video.js
      this.player = videojs(el, {
        controls: true,
        preload: 'auto',
        fluid: true,
        sources: [{ src: this.chosenSrc, type: 'video/mp4' }],
      });

      // on error, fall back to next lower quality
      this.player.on('error', () => {
        const idx = this.currentSources.findIndex(s => s.src === this.chosenSrc);
        const next = this.currentSources[idx + 1];
        if (next) {
          this.chosenSrc = next.src;
          this.player?.src({ src: next.src, type: next.type });
          this.player?.play();
        }
      });

      // focus overlay for ESC
      (document.querySelector('.overlay') as HTMLElement)?.focus();
    });
  }

  close(): void {
    this.active = null;
    this.player?.dispose();
    this.player = undefined;
  }

  /* Quality selector */
  onQualityChange(newSrc: string): void {
    if (!this.player || newSrc === this.chosenSrc) return;
    this.chosenSrc = newSrc;
    this.player.src({ src: newSrc, type: 'video/mp4' });
    this.player.play();
  }

  /* Hotkey */
  @HostListener('window:keydown.escape')
  esc(): void {
    if (this.active) this.close();
  }

  /* Helpers */
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

  /** Build a list of quality-labelled sources derived from the original filename. */
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
