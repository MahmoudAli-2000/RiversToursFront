import { AuthService } from './../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent {
  
  private readonly authService=inject(AuthService);
  private readonly router=inject(Router);
    private readonly toasterService = inject(ToastrService);
  
  onLogout() {
    this.authService.LogOut().subscribe({
      next: () => {
        this.toasterService.success('Logged out successfully');
        this.router.navigate(['/admin/login']); // redirect لصفحة login
      },
      error: () => {
        this.toasterService.error('Logout failed');
      }
    });
}}
