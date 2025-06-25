// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messagesSubject = new Subject<string>();
  public messages$: Observable<string> = this.messagesSubject.asObservable();

  /** Neue Toast-Nachricht auslösen */
  show(message: string): void {
    this.messagesSubject.next(message);
  }
}
