import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { first, tap } from 'rxjs';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';

import { AuthService } from '@shared/auth/services';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    Button
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageComponent {
  private readonly nonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly authForm = this.nonNullableFormBuilder.group({
    email: this.nonNullableFormBuilder.control<string>('', [Validators.minLength(3), Validators.email, Validators.required]),
    password: this.nonNullableFormBuilder.control<string>('', [Validators.minLength(3), Validators.required]),
  })

  loginUser() {
    const { email, password } = this.authForm.getRawValue();

    this.authService.signIn$(email, password)
      .pipe(
        first(),
        tap(() => this.router.navigate(['observer'])),
      )
      .subscribe();
  }
}
