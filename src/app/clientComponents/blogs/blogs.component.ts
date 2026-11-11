import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { RouterLink } from "@angular/router";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, TranslatedPipe, RouterLink],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  blogs = [
    {
      titleKey: 'BLOGS.HURGHADA.TITLE',
      excerptKey: 'BLOGS.HURGHADA.EXCERPT',
      image: 'assets/images/img5.jpg',
      date: 'July 2025',
      categoryKey: 'BLOGS.CATEGORY.TRAVEL_TIPS',
      slug: 'hurghadaBlog'

    },
    {
      titleKey: 'BLOGS.LUXOR.TITLE',
      excerptKey: 'BLOGS.LUXOR.EXCERPT',
      image: 'assets/images/img2.jpg',
      date: 'July 2025',
      categoryKey: 'BLOGS.CATEGORY.HISTORY',
      slug: 'luxorBlog'

    }
  ];
    constructor(private meta: Meta, private title: Title) {}
  
    ngOnInit() {
      this.title.setTitle(
        'Travel Blog | Egypt & Hurghada Travel Tips – Rivers Tours Travels'
      );
    
      this.meta.updateTag({
        name: 'description',
        content:
          'Explore Rivers Tours Travels blog for the best travel tips, destination guides, and things to do in Hurghada and across Egypt.'
      });
    
      this.meta.updateTag({
        name: 'keywords',
        content:
          'Egypt travel blog, Hurghada travel tips, things to do in Egypt, Red Sea travel guide'
      });
    }
    
}
