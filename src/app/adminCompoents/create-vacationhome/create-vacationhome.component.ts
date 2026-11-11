import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VacationHomeService } from '../../core/services/vacationhome.service';

interface VacationHomeImageFile {
  file: File | null;
  preview: string | ArrayBuffer | null;
  isActive: boolean;
}

@Component({
  selector: 'app-create-vacationhome',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-vacationhome.component.html',
  styleUrl: '../create-tour/create-tour.component.css'
})
export class CreateVacationhomeComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly vacationHomeService = inject(VacationHomeService);
  private readonly router = inject(Router);
  private readonly toaster = inject(ToastrService);

  readonly languages = ['en', 'de', 'pl', 'fr'];
  readonly destinations = [
    { id: 2, name: 'Hurghada' },
    { id: 3, name: 'Marsa Alam' },
    { id: 4, name: 'Aswan' }
  ];
  readonly propertyTypes = [
    { value: 1, label: 'Apartment' },
    { value: 2, label: 'Villa' },
    { value: 3, label: 'Chalet' },
    { value: 4, label: 'Studio' }
  ];
  selectedLang = 'en';
  isSubmitting = false;
  selectedMainImage: File | null = null;
  mainImagePreview: string | ArrayBuffer | null = null;
  galleryImages: VacationHomeImageFile[] = [];

  readonly homeForm = this.formBuilder.group({
    referenceName: ['', Validators.required],
    slug: [''],
    propertyType: [null as number | null, Validators.required],
    isActive: [true],
    city: ['', Validators.required],
    area: [''],
    address: ['', Validators.required],
    googleMapsUrl: ['', Validators.pattern(/^$|https?:\/\/.+|<iframe\b(?=[^>]*\bsrc\s*=\s*["']https?:\/\/(?:www\.)?google\.com\/maps\/embed)[^>]*>\s*<\/iframe>$/i)],
    latitude: [null as number | null],
    longitude: [null as number | null],
    priceDollar: [0, [Validators.required, Validators.min(0)]],
    priceEuro: [0, [Validators.required, Validators.min(0)]],
    destinationId: [null as number | null],
    translations: this.formBuilder.group({
      en: this.createTranslationGroup(),
      de: this.createTranslationGroup(),
      pl: this.createTranslationGroup(),
      fr: this.createTranslationGroup()
    })
  });

  private createTranslationGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  translationGroup(language: string): FormGroup {
    return this.homeForm.get(['translations', language]) as FormGroup;
  }

  onMainImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedMainImage = input.files?.[0] ?? null;
    if (!this.selectedMainImage) return;

    const reader = new FileReader();
    reader.onload = () => this.mainImagePreview = reader.result;
    reader.readAsDataURL(this.selectedMainImage);
  }

  removeMainImage(input: HTMLInputElement): void {
    this.selectedMainImage = null;
    this.mainImagePreview = null;
    input.value = '';
  }

  addGalleryImage(): void {
    this.galleryImages.push({ file: null, preview: null, isActive: true });
  }

  onGalleryImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.galleryImages[index].file = file;
      this.galleryImages[index].preview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  removeGalleryImage(index: number): void {
    this.galleryImages.splice(index, 1);
  }

  onSubmit(): void {
    this.homeForm.markAllAsTouched();
    if (this.homeForm.invalid || this.isSubmitting) {
      this.toaster.error('Please complete all required fields correctly.', 'Validation Error');
      return;
    }
    if (!this.selectedMainImage) {
      this.toaster.error('Please select a cover image.', 'Validation Error');
      return;
    }
    if (this.galleryImages.some(image => !image.file)) {
      this.toaster.error('Select a file for each gallery image or remove the empty image item.', 'Validation Error');
      return;
    }

    this.isSubmitting = true;
    this.vacationHomeService.create(this.buildFormData()).subscribe({
      next: () => {
        this.toaster.success('Vacation home created successfully.', 'Success');
        this.router.navigate(['/admin/vacationhomes']);
      },
      error: error => {
        console.error('Error creating vacation home', error);
        this.toaster.error(this.getApiErrorMessage(error), 'Create failed');
        this.isSubmitting = false;
      }
    });
  }

  private getApiErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) return 'An unexpected error occurred while creating the vacation home.';
    if (error.status === 0) return 'The API could not be reached. Check the API URL, HTTPS certificate, and CORS settings.';

    const body = error.error as { message?: string; title?: string; detail?: string; errors?: Record<string, string[]> } | null;
    const validationErrors = body?.errors
      ? Object.values(body.errors).flat().join(' ')
      : '';
    return validationErrors || body?.detail || body?.message || body?.title ||
      `The API rejected the request (${error.status} ${error.statusText}).`;
  }

  private buildFormData(): FormData {
    const value = this.homeForm.getRawValue();
    const formData = new FormData();
    formData.append('ReferneceName', value.referenceName ?? '');
    formData.append('Slug', value.slug ?? '');
    formData.append('PropertyType', String(value.propertyType ?? 0));
    formData.append('IsActive', String(value.isActive));
    formData.append('City', value.city ?? '');
    formData.append('Area', value.area ?? '');
    formData.append('Address', value.address ?? '');
    formData.append('GoogleMapsUrl', value.googleMapsUrl ?? '');
    formData.append('PriceDollar', String(value.priceDollar ?? 0));
    formData.append('PriceEuro', String(value.priceEuro ?? 0));
    if (value.latitude !== null && value.latitude !== undefined) formData.append('Latitude', String(value.latitude));
    if (value.longitude !== null && value.longitude !== undefined) formData.append('Longitude', String(value.longitude));
    if (value.destinationId !== null && value.destinationId !== undefined) {
      formData.append('FK_DestinationID', String(value.destinationId));
    }
    if (this.selectedMainImage) formData.append('ImageFile', this.selectedMainImage);

    const translations = this.languages.map(language => ({
      Language: language,
      Name: this.translationGroup(language).get('name')?.value ?? '',
      Description: this.translationGroup(language).get('description')?.value ?? ''
    }));
    formData.append('TranslationsJson', JSON.stringify(translations));

    this.galleryImages.forEach((image, index) => {
      if (!image.file) return;
      formData.append(`ImagesList[${index}].ImageFile`, image.file);
      formData.append(`ImagesList[${index}].IsActive`, String(image.isActive));
    });
    return formData;
  }
}
