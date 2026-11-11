import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css'
})
export class NotfoundComponent {
  particles = [1, 2, 3, 4];
  debrisItems = [1, 2, 3];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initAnimations();
  }

  initAnimations(): void {
    // يمكن إضافة منطق إضافي للتحريك إذا لزم الأمر
  }


  // توليد جزيئات  عشوائية للحركة
  generateParticles(count: number): void {
    this.particles = Array(count).fill(0).map((_, i) => i);
  }
  
}