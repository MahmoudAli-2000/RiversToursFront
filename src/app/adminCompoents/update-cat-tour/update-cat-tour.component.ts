import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CattourService } from '../../core/services/cattour.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../core/environments/environments';
import { Meta } from '@angular/platform-browser';
interface FormErrorSummary {
  label: string;
  lang?: string;
}

@Component({
  selector: 'app-update-cat-tour',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass,CommonModule],
  templateUrl: './update-cat-tour.component.html',
  styleUrl: './update-cat-tour.component.css'
})
export class UpdateCatTourComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);

  languages = ['en', 'de', 'pl', 'fr'];
  selectedLang: string = 'en';

  catTourForm: FormGroup;
  formErrors: FormErrorSummary[] = [];

  catTourId!: number;

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private catTourService: CattourService,
    private route: ActivatedRoute
  ) {
    this.catTourForm = this.buildForm();
  }

  ngOnInit() {
    this.catTourId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategoryTour();
  }

  // =========================
  // Build Form
  // =========================
  private buildForm(): FormGroup {
    const translations: any = {};
    this.languages.forEach(lang => {
      translations[lang] = this.createTranslationGroup();
    });

    return this.fb.group({
      referenceName: ['', Validators.required],
      isActive: [true],
      translations: this.fb.group(translations),
    });
  }

  private createTranslationGroup(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: [''],
      metaDescription: [''],
      metaKeyWords: ['']

    });
  }

  getTranslationGroup(lang: string): FormGroup {
    return this.catTourForm.get(['translations', lang]) as FormGroup;
  }

  // =========================
  // Load & Patch
  // =========================
  loadCategoryTour() {
    this.catTourService.getAllDetaildedCategoryTour(this.catTourId).subscribe(res => {
      console.log('Loaded Category Tour:');
      console.log(res);
      this.patchBasicData(res);
      this.patchTranslations(res.translations);

      // الصورة القديمة
      if (res.imageCover) {
        this.imagePreview = `${environment.BaseUrl}/${res.imageCover}`;
      }

      // اجعل أول لغة متاحة هي المفتوحة تلقائياً
      this.selectedLang =
        this.languages.find(lang => res.translations.some((translation: any) => translation.language === lang)) ??
        this.languages[0];
    });
  }

  private patchBasicData(data: any) {
    this.catTourForm.patchValue({
      referenceName: data.referneceName,
      isActive: data.isActive
    });
  }

  private patchTranslations(translations: any[]) {
    this.languages.forEach(lang => {
      const tr = translations.find(t => t.language === lang);
      if (tr) {
        this.getTranslationGroup(lang).patchValue({
          title: tr.title,
          description: tr.description,
            metaDescription: tr.metaDescription ?? '',
        metaKeyWords: tr.metaKeyWords ?? ''
        });
      }
    });
  }

  // =========================
  // Image
  // =========================
  onFileSelected(event: any) {
    if (!event.target.files?.length) return;

    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    if (this.selectedFile){
    reader.readAsDataURL(this.selectedFile);}
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
  }

  // =========================
  // Submit Update
  // =========================
  onSubmit() {
    if (this.catTourForm.invalid) {
      this.toaster.error('Please complete required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();
    formData.append('ReferneceName', this.catTourForm.value.referenceName);
    formData.append('IsActive', this.catTourForm.value.isActive);

    const translations = this.languages.map(lang => {
      const tr = this.getTranslationGroup(lang).value;
      return {
        Language: lang,
        Title: tr.title,
        Description: tr.description,
        MetaDescription: tr.metaDescription,
        MetaKeyWords: tr.metaKeyWords
      };
    });
    formData.append('TranslationsJson', JSON.stringify(translations));

    // تبع الصورة فقط لو اتغيرت
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.catTourService.updateCatTour(this.catTourId, formData).subscribe({
      next: () => {
        this.toaster.success('Category Tour updated successfully', 'Success');
        this.router.navigate(['/admin/categorytour']);
      },
      error: () => {
        this.toaster.error('Error updating category tour', 'Error');
      }
    });
  }
}