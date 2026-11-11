import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { TransferService } from '../../core/services/transfer.service';
import { ItransferWithPrices } from '../../core/interfaces/itransfer';
import { Subscription, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { ReloadService } from '../../core/services/reload.service';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-transfers-detail',
  standalone: true,
  imports: [CommonModule,TranslatedPipe],
  templateUrl: './transfers-detail.component.html',
  styleUrl: './transfers-detail.component.css'
})
export class TransfersDetailComponent  extends ReloadableComponent   {

  // DetailedTransfer:ItransferWithPrices|null=null;
  DetailedTransfer = signal<ItransferWithPrices | null>(null);
  private readonly seo = inject(SeoService);

  constructor(
    reloadService: ReloadService,
    private service: TransferService,
    private route: ActivatedRoute,
  ) {
    super(reloadService);
  }

  ngOnInit(): void {
    this.loadData();
    this.onReload(() => this.loadData());
  }

  private loadData(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const slug = params.get('slug') ?? '';
  
          // 🔹 Fallback title (قبل ما الداتا ترجع)
          const formattedTitle = slug.replace(/-/g, ' ');
          this.seo.update({
            title: `${formattedTitle} Transfer | Egypt Airport Transfers | Rivers Tours`,
            description: `Book ${formattedTitle} with Rivers Tours Travels for a safe, comfortable and reliable transfer in Egypt.`,
            keywords: `${formattedTitle} transfer, Egypt airport transfer, Hurghada private transfer, Rivers Tours Travels`,
            canonicalPath: `/transferDetail/${encodeURIComponent(slug)}`
          });
  
          return this.service.getDetaildedTransfers(slug);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: ItransferWithPrices) => {
  
          this.DetailedTransfer.set(res);
  
          this.seo.update({
            title: `${res.names} to ${res.destinationName} | Hurghada Transfers | Rivers Tours`,
            description: res.metaDescription || `Book ${res.names} to ${res.destinationName} with Rivers Tours Travels. Enjoy a safe and comfortable airport transfer in Egypt.`,
            keywords: res.metaKeyWords || `${res.names}, ${res.destinationName} transfer, Egypt airport transfer, Hurghada private transfer, Rivers Tours Travels`,
            canonicalPath: `/transferDetail/${encodeURIComponent(res.slug)}`,
            imageUrl: res.imageCover,
            type: 'article'
          });
        },
        error: err => console.error(err)
      });
  };
  


}
