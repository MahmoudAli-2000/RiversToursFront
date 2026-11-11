import { Component, inject } from '@angular/core';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hurghadablogs',
  standalone: true,
  imports: [TranslatedPipe],
  templateUrl: './hurghadablogs.component.html',
  styleUrl: './hurghadablogs.component.css'
})
export class HurghadablogsComponent {
  private readonly meta=inject(Meta);
  private readonly title=inject(Title);

  ngOnInit() {
    this.title.setTitle(
      'Hurghada Travel Blog | Things to Do & Travel Tips – RiversTours'
    );
  
    this.meta.updateTag({
      name: 'description',
      content:
        'Discover the best travel tips, activities, and attractions in Hurghada. Explore beaches, desert safaris, snorkeling spots, and local experiences with RiversTours travel blog.'
    });
  
    this.meta.updateTag({
      name: 'keywords',
      content:
        'Hurghada travel blog, things to do in Hurghada, Hurghada travel guide, Red Sea activities, snorkeling Hurghada, RiversTours blog'
    });
  }
}
