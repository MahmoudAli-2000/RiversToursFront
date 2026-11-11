import { Component, inject } from '@angular/core';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { Meta, Title } from '@angular/platform-browser';
import { TitleStrategy } from '@angular/router';

@Component({
  selector: 'app-luxorblog',
  standalone: true,
  imports: [TranslatedPipe],
  templateUrl: './luxorblog.component.html',
  styleUrl: './luxorblog.component.css'
})
export class LuxorblogComponent {
  private readonly meta=inject(Meta);
  private readonly title=inject(Title);

  ngOnInit() {
    this.title.setTitle(
      'Luxor Travel Blog | Ancient Temples & Day Trips – RiversTours'
    );
  
    this.meta.updateTag({
      name: 'description',
      content:
        'Explore Luxor travel guides, ancient temples, and historical attractions. Learn about the Valley of the Kings, Karnak Temple, and unforgettable Luxor day trips with RiversTours.'
    });
  
    this.meta.updateTag({
      name: 'keywords',
      content:
        'Luxor travel blog, Luxor travel guide, Valley of the Kings tour, Karnak Temple guide, Luxor day trips from Hurghada, Egypt history tours'
    });
  }
}
