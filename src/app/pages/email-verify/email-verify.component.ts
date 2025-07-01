import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-verify',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss'],
})
export class EmailVerifyComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private auth   = inject(AuthService);
  private router = inject(Router);

  loading = true;
  ok      = false;
  err     = false;

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code')!;
    this.auth.verifyEmail(code).subscribe({
      next: () => {
        this.ok = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.err = true;
        this.loading = false;
      },
    });
  }
}
