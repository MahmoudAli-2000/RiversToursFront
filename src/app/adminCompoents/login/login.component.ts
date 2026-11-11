import { CommonModule, NgClass } from '@angular/common';
import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap, delay } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule, NgClass]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  IsSccuess = false;
  showPassword = false;
  serverError: string = '';
  returnUrl: string = '/admin/tours';

  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly toasterService = inject(ToastrService);

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // الحصول على returnUrl من query params
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/admin/tours';
  }

// login.component.ts
onSubmit(): void {
  this.submitted = true;
  this.serverError = '';

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const loginData = this.loginForm.value;

  this.authService.Login(loginData).subscribe({
    next: (res: any) => {
      this.IsSccuess = true;
      this.toasterService.success('Login valid!', 'Success');

      // حفظ حالة login في localStorage/sessionStorage
      localStorage.setItem('isLoggedIn', 'true');

      // redirect مباشرة بدون checkAuth
      this._router.navigateByUrl(this.returnUrl);
    },
    error: (err) => {
      this.toasterService.error('Invalid email or password', 'Login Failed');
    }
  });
}

}
