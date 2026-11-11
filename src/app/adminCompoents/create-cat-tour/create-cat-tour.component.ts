import { HttpErrorResponse } from '@angular/common/http';
import { CattourService } from './../../core/services/cattour.service';
import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearchPipe } from '../../core/pipes/search.pipe';

@Component({
  selector: 'app-create-cat-tour',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass,CommonModule],
  templateUrl: './create-cat-tour.component.html',
  styleUrl: './create-cat-tour.component.css'
})
export class CreateCatTourComponent {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);

  languages = ['en', 'de', 'pl', 'fr'];

  catTourForm: FormGroup;
  formErrors: { label: string; lang?: string }[] = [];

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  selectedLang: string = 'en';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private catTourService: CattourService
  ) {
    this.catTourForm = this.buildForm();
  }

  // =========================
  // Form Builder
  // =========================
  private buildForm(): FormGroup {
    const translationsGroup: any = {};
    this.languages.forEach(lang => {
      translationsGroup[lang] = this.createTranslationGroup();
    });

    return this.fb.group({
      referenceName: ['', Validators.required],
      isActive: [true],

      translations: this.fb.group(translationsGroup)
    });
  }

  private createTranslationGroup(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['',Validators.required],
      metaDescription: [''],
      metaKeywords: ['']

    });
  }

  // =========================
  // Helpers
  // =========================
  getTranslationGroup(lang: string): FormGroup {
    return this.catTourForm.get(['translations', lang]) as FormGroup;
  }

  // =========================
  // Image
  // =========================
  onFileSelected(event: any) {
    if (!event.target.files?.length) return;

    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result);
    if (this.selectedFile){
    reader.readAsDataURL(this.selectedFile);
  }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
  }

  // =========================
  // Error Summary
  // =========================
  buildErrorSummary() {
    this.formErrors = [];

    if (this.catTourForm.get('referenceName')?.invalid) {
      this.formErrors.push({ label: 'Reference Name' });
    }

    this.languages.forEach(lang => {
      const group = this.getTranslationGroup(lang);
      if (group.get('title')?.invalid) {
        this.formErrors.push({ label: 'Title', lang });
      }
      if (group.get('description')?.invalid) {
        this.formErrors.push({ label: 'Description', lang });
      }
      if (group.get('metaDescription')?.invalid) {
        this.formErrors.push({ label: 'Meta Description', lang });
      }
      if (group.get('metaKeywords')?.invalid) {
        this.formErrors.push({ label: 'Meta Keywords', lang });
      }
    });
  }

  // =========================
  // Submit
  // =========================
  onSubmit() {
    this.buildErrorSummary();

    if (this.catTourForm.invalid) {
      this.toaster.error('Please complete required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    formData.append('ReferneceName', this.catTourForm.value.referenceName);
    formData.append('IsActive', this.catTourForm.value.isActive);

    const translations = this.languages.map(lang => ({
      Language: lang,
      Title: this.getTranslationGroup(lang).value.title,
      Description: this.getTranslationGroup(lang).value.description,
      MetaDescription: this.getTranslationGroup(lang).value.metaDescription,
      MetaKeyWords: this.getTranslationGroup(lang).value.metaKeywords
    }));

    formData.append('TranslationsJson', JSON.stringify(translations));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.catTourService.createCatTour(formData).subscribe({
      next: () => {
        this.toaster.success('Category Tour created successfully', 'Success');
        this.catTourForm.reset({ isActive: true });
        this.router.navigate(['/admin/categorytour']);
      },
      error: () => {
        this.toaster.error('Error creating category tour', 'Error');
      }
    });
  }
}
