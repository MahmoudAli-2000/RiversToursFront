import { ReloadService } from './../../core/services/reload.service';
import { Component, inject, signal, WritableSignal,PLATFORM_ID, Inject  } from '@angular/core';
import { IdetailedCattour } from '../../core/interfaces/icat-tour';
import { Subscription, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CattourService } from '../../core/services/cattour.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-category-tour-detail',
  standalone: true,
  imports: [RouterLink,TranslatedPipe,CommonModule],
  templateUrl: './category-tour-detail.component.html',
  styleUrl: './category-tour-detail.component.css'
})
export class CategoryTourDetailComponent  extends ReloadableComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,ReloadService:ReloadService) {
    super(ReloadService);
  }

    DetailedCategoryTour:WritableSignal<IdetailedCattour|null>=signal(null);
    CategorySubs:WritableSignal<Subscription|null>=signal(null);
  
  
    private readonly categoryService=inject(CattourService);
    private readonly activeRouete=inject(ActivatedRoute);
     private readonly seo = inject(SeoService);

  
  
    ngOnInit(): void {
      this.LoadData();
      this.onReload(() => this.LoadData());
    }
  
    LoadData() {

      if (isPlatformBrowser(this.platformId)) {
        document.body.classList.add('category-open');
      }
    
      this.activeRouete.paramMap
        .pipe(
          switchMap(params => {
            const slug = params.get('slug') ?? '';
    
            // Fallback title (قبل ما الداتا ترجع)
            const formattedTitle = slug.replace(/-/g, ' ');
            this.seo.update({
              title: `${formattedTitle} | Hurghada Tours | Rivers Tours`,
              description: `Explore ${formattedTitle} excursions and activities in Hurghada and across Egypt with Rivers Tours Travels.`,
              keywords: `${formattedTitle}, Hurghada tours, Egypt excursions, Red Sea activities, Rivers Tours Travels`,
              canonicalPath: `/categrytourDetail/${encodeURIComponent(slug)}`
            });
    
            return this.categoryService.getDetaildedCategorTour(slug);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (res: IdetailedCattour) => {
    
            this.DetailedCategoryTour.set(res);
    
            this.seo.update({
              title: `${res.titles} | Hurghada Tours | Rivers Tours`,
              description: res.metaDescription || `Explore ${res.titles} with Rivers Tours Travels. Discover tours and excursions in Hurghada and across Egypt.`,
              keywords: res.metaKeyWords || `${res.titles}, Hurghada tours, Egypt excursions, Red Sea activities, Rivers Tours Travels`,
              canonicalPath: `/categrytourDetail/${encodeURIComponent(res.slug)}`,
              imageUrl: res.imageCover,
              type: 'article'
            });
          },
          error: (err: HttpErrorResponse) => {
            console.log(err.message);
          }
        });
    };
    
    // ngOnDestroy(): void {
    //   if (isPlatformBrowser(this.platformId)) {
    //     document.body.classList.remove('category-open');
    //   }
    //   if(this.CategorySubs()){
    //     this.CategorySubs()?.unsubscribe();
    //   }
    // }

}
