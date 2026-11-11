import { Component, inject } from '@angular/core';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [TranslatedPipe],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
   private readonly meta=inject(Meta);
   private readonly title=inject(Title);

   ngOnInit() {
    this.title.setTitle(
      'Customer Reviews & Testimonials | Rivers Tours Travels Hurghada'
    );
  
    this.meta.updateTag({
      name: 'description',
      content:
        'Read real customer reviews about Rivers Tours Travels and discover why travelers trust us for tours, excursions, transfers, and unforgettable travel experiences in Hurghada and Egypt.'
    });
  
    this.meta.updateTag({
      name: 'keywords',
      content:
        'Rivers Tours Travels reviews, Hurghada travel reviews, Egypt tour reviews, trusted travel agency Hurghada, travel testimonials Egypt'
    });
  }
}
