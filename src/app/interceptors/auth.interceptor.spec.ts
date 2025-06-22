// src/app/interceptors/auth.interceptor.spec.ts
import { TestBed } from '@angular/core/testing';
import { authInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [authInterceptor ],
    })
  );

  it('should be created', () => {
    const interceptor = TestBed.inject(authInterceptor );
    expect(interceptor).toBeTruthy();
  });
});
