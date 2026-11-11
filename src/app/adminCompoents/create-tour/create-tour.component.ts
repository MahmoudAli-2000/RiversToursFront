import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TourService } from '../../core/services/tour.service';
import { CommonModule, NgClass } from '@angular/common';

interface FormErrorSummary {
  label: string;
  lang?: string;
}

interface TourImageItem {
  file: File | null;
  preview: string | ArrayBuffer | null;
  isActive: boolean;
  translations: {
    lang: string;
    title: string;
    tourName: string;
  }[];
}

@Component({
  selector: 'app-create-tour',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-tour.component.html',
  styleUrl: './create-tour.component.css'
})
export class CreateTourComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);

  languages = ['en', 'de', 'pl', 'fr'];
  selectedLang: string = 'en';
  categories = [
    { id: 3, name: 'Sea Tours Hurghada' },
    { id: 4, name: 'Things To Do Hurghada' },
    { id: 5, name: 'Diving Tours Hurghada' },
    { id: 6, name: 'Cairo Tours Hurghada' },
    { id: 7, name: 'Luxor Tours Hurghada' },
    { id: 8, name: 'Safari Tours Hurghada' },
    { id: 10, name: 'Nile Cruises Aswan' },
    { id: 11, name: 'Aswan Day Trips & Sightseeing' },
    { id: 12, name: 'Cultural Heritage Tours Aswan' },
    { id: 13, name: 'Private Customized Packages Aswan' },
    { id: 14, name: 'Sea Tours Marsa Alam' },
    { id: 15, name: 'Things To Do Marsa Alam' },
    { id: 16, name: 'Diving Tours Marsa Alam' },
    { id: 17, name: 'Cairo Tours Marsa Alam' },
    { id: 18, name: 'Luxor Tours Marsa Alam' },
    { id: 19, name: 'Safari Tours Marsa Alam' }
  ];
  destinations = [
    { id: 2, name: 'Hurghada' },
    { id: 3, name: 'Marsa Alam' },
    { id: 4, name: 'Aswan' }
  ];
  tourForm: FormGroup;
  formErrors: FormErrorSummary[] = [];

  // =========================
  // Main Image
  // =========================
  selectedMainImage: File | null = null;
  mainImagePreview: string | ArrayBuffer | null = null;

  @ViewChild('mainImageInput') mainImageInput!: ElementRef<HTMLInputElement>;

  // =========================
  // Gallery Images
  // =========================
  imagesList: TourImageItem[] = [];

  constructor(
    private fb: FormBuilder,
    private tourService: TourService
  ) {
    this.tourForm = this.buildForm();
  }

  // =========================
  // Form Builder
  // =========================
  private buildForm(): FormGroup {
    return this.fb.group({
      referenceName: ['', Validators.required],
      isActive: [true],

      fkCategoryId: [null, Validators.required],
      fkDestinationId: [2, Validators.required],

      duration: [0, Validators.required],
      priceDollar: [0, Validators.required],
      priceEuro: [0, Validators.required],

      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      languageOptions: ['', Validators.required],

      linkVideo: [''],

      translations: this.fb.group({
        en: this.createTranslationGroup(),
        de: this.createTranslationGroup(),
        pl: this.createTranslationGroup(),
        fr: this.createTranslationGroup(),
      }),

      includes: this.fb.group({
        en: this.fb.array([]),
        de: this.fb.array([]),
        pl: this.fb.array([]),
        fr: this.fb.array([]),
      }),

      notIncludes: this.fb.group({
        en: this.fb.array([]),
        de: this.fb.array([]),
        pl: this.fb.array([]),
        fr: this.fb.array([]),
      }),
      
      whyus: this.fb.group({
        en: this.fb.array([]),
        de: this.fb.array([]),
        pl: this.fb.array([]),
        fr: this.fb.array([]),
      }),

      highlights: this.fb.group({
        en: this.fb.array([]),
        de: this.fb.array([]),
        pl: this.fb.array([]),
        fr: this.fb.array([]),
      }),
    });
  }

  private createTranslationGroup(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      durationType: ['', Validators.required],
      metaDescription: [''],
      metaKeywords: ['']
    });
  }

  // =========================
  // Helpers
  // =========================
  getTranslationGroup(lang: string): FormGroup {
    return this.tourForm.get(['translations', lang]) as FormGroup;
  }

  getIncludes(lang: string): FormArray {
    return this.tourForm.get(['includes', lang]) as FormArray;
  }

  getNotIncludes(lang: string): FormArray {
    return this.tourForm.get(['notIncludes', lang]) as FormArray;
  }

  getHighlights(lang: string): FormArray {
    return this.tourForm.get(['highlights', lang]) as FormArray;
  }

  getwhyus(lang: string): FormArray {
    return this.tourForm.get(['whyus', lang]) as FormArray;
  }

  // =========================
  // Add / Remove
  // =========================
  addInclude(lang: string) {
    this.getIncludes(lang).push(
      this.fb.group({
        text: ['', Validators.required],
        Language: [lang]
      })
    );
  }

  removeInclude(lang: string, index: number) {
    this.getIncludes(lang).removeAt(index);
  }

  addNotInclude(lang: string) {
    this.getNotIncludes(lang).push(
      this.fb.group({
        text: ['', Validators.required],
        Language: [lang]
      })
    );
  }

  removeNotInclude(lang: string, index: number) {
    this.getNotIncludes(lang).removeAt(index);
  }

  addHighlight(lang: string) {
    this.getHighlights(lang).push(
      this.fb.group({
        text: ['', Validators.required],
        Language: [lang]
      })
    );
  }

  removeHighlight(lang: string, index: number) {
    this.getHighlights(lang).removeAt(index);
  }
  addwhyus(lang: string) {
    this.getwhyus(lang).push(
      this.fb.group({
        text: ['', Validators.required],
        Language: [lang]
      })
    );
  }

  removewhyus(lang: string, index: number) {
    this.getwhyus(lang).removeAt(index);
  }

  // =========================
  // Validation Helper
  // =========================
  private validateArrays(): boolean {
    let isValid = true;
    
    this.languages.forEach(lang => {
      const includes = this.getIncludes(lang).value;
      const notIncludes = this.getNotIncludes(lang).value;
      const highlights = this.getHighlights(lang).value;
      const whyus = this.getwhyus(lang).value;
      
      // تحقق من أن كل عنصر يحتوي على نص
      [...includes, ...notIncludes, ...highlights,...whyus].forEach((item: any) => {
        if (item && !item.text?.trim()) {
          isValid = false;
        }
      });
    });
    
    return isValid;
  }

  // =========================
  // Main Image
  // =========================
  onMainImageSelected(event: any) {
    if (!event.target.files?.length) return;

    this.selectedMainImage = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => (this.mainImagePreview = reader.result);
    if (this.selectedMainImage) {
      reader.readAsDataURL(this.selectedMainImage);
    }
  }

  removeMainImage() {
    this.selectedMainImage = null;
    this.mainImagePreview = null;
    this.mainImageInput.nativeElement.value = '';
  }

  // =========================
  // Gallery Images
  // =========================
  addGalleryImage() {
    this.imagesList.push({
      file: null,
      preview: null,
      isActive: true,
      translations: this.languages.map(lang => ({
        lang,
        title: '',
        tourName: ''
      }))
    });
  }

  onGalleryImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagesList[index].file = file;
      this.imagesList[index].preview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  removeGalleryImage(index: number) {
    this.imagesList.splice(index, 1);
  }

  // =========================
  // Error Summary
  // =========================
  buildErrorSummary() {
    this.formErrors = [];

    this.checkControl('referenceName', 'Reference Name');
    this.checkControl('fkCategoryId', 'Category');
    this.checkControl('fkDestinationId', 'Destination');
    this.checkControl('duration', 'Duration');
    this.checkControl('priceDollar', 'Price (USD)');
    this.checkControl('priceEuro', 'Price (EUR)');
    this.checkControl('startLocation', 'Start Location');
    this.checkControl('endLocation', 'End Location');
    this.checkControl('languageOptions', 'Language Options');


    this.languages.forEach(lang => {
      const group = this.getTranslationGroup(lang);
      if (group.get('title')?.invalid)
        this.formErrors.push({ label: 'Title', lang });
      if (group.get('description')?.invalid)
        this.formErrors.push({ label: 'Description', lang });
      if (group.get('durationType')?.invalid)
        this.formErrors.push({ label: 'Duration Type', lang });

      if (group.get('metaKeywords')?.invalid)
        this.formErrors.push({ label: 'metaKeywords', lang });
      if (group.get('metaDescription')?.invalid)
        this.formErrors.push({ label: 'metaDescription', lang });
    });
  }

  private checkControl(controlName: string, label: string) {
    const control = this.tourForm.get(controlName);
    if (control && control.invalid && control.touched)
      this.formErrors.push({ label });
  }

  // =========================
  // Data Collection
  // =========================
  private collectText(key: 'includes' | 'notIncludes' | 'highlights'|'whyus'): any[] {
    const result: any[] = [];
    this.languages.forEach(lang => {
      const array = this.tourForm.get([key, lang])?.value;
      if (array && Array.isArray(array)) {
        array.forEach((item: any) => {
          if (item && item.text) {
            result.push({ Text: item.text, Language: item.Language || lang });
          }
        });
      }
    });
    return result;
  }

  // =========================
  // Submit
  // =========================
  onSubmit() {
    this.tourForm.markAllAsTouched();
    this.buildErrorSummary();

    if (this.tourForm.invalid || !this.validateArrays()) {
      this.toaster.error('Please complete all required fields correctly', 'Validation Error');
      return;
    }

    const formData = new FormData();

    const v = this.tourForm.value;

    formData.append('ReferneceName', v.referenceName);
    formData.append('IsActive', v.isActive);
    formData.append('FK_CategoryID', v.fkCategoryId);
    formData.append('FK_DestinationID', v.fkDestinationId);

    formData.append('Duration', v.duration);
    formData.append('PriceDollar', v.priceDollar);
    formData.append('PriceEuro', v.priceEuro);
    formData.append('StartLocation', v.startLocation);
    formData.append('EndLocation', v.endLocation);
    formData.append('LanguageOptions', v.languageOptions);
    formData.append('LinkVideo', v.linkVideo || '');

    // =========================
    // Translations
    // =========================
    const translations = this.languages.map(lang => ({
      Language: lang,
      Title: this.getTranslationGroup(lang).value.title,
      Description: this.getTranslationGroup(lang).value.description,
      DurationType: this.getTranslationGroup(lang).value.durationType,
      MetaDescription: this.getTranslationGroup(lang).value.metaDescription,
      MetaKeyWords: this.getTranslationGroup(lang).value.metaKeywords
    }));
    formData.append('TranslationsJson', JSON.stringify(translations));

    // =========================
    // Includes, Not Includes, Highlights
    // =========================
    formData.append('IncludesJson', JSON.stringify(this.collectText('includes')));
    formData.append('NonIncludesJson', JSON.stringify(this.collectText('notIncludes')));
    formData.append('hightlightJson', JSON.stringify(this.collectText('highlights')));
    formData.append('whyusJson', JSON.stringify(this.collectText('whyus')));


    // =========================
    // Main Image
    // =========================
    if (this.selectedMainImage) {
      formData.append('ImageFile', this.selectedMainImage);
    }

    // =========================
    // Gallery Images
    // =========================
    this.imagesList.forEach((img, i) => {
      if (!img.file) return;

      formData.append(`ImagesList[${i}].ImageFile`, img.file);
      formData.append(`ImagesList[${i}].IsActive`, String(img.isActive));

      const imgTranslations = img.translations.map(t => ({
        Language: t.lang,
        Title: t.title,
        TourName: t.tourName
      }));

      formData.append(
        `ImagesList[${i}].TranslationsJson`,
        JSON.stringify(imgTranslations)
      );
    });

    this.tourService.createTour(formData).subscribe({
      next: () => {
        this.toaster.success('Tour created successfully', 'Success');
        this.router.navigate(['/admin/tours']);
      },
      error: (error) => {
        console.error('Error creating tour:', error);
        this.toaster.error('Error creating tour. Please try again.', 'Error');
      }
    });
  }
}