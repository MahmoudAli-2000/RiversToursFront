import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TransferService } from '../../core/services/transfer.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../core/environments/environments';

interface FormErrorSummary {
  label: string;
  lang?: string;
}

@Component({
  selector: 'app-update-transfer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-transfer.component.html',
  styleUrl: './update-transfer.component.css'
})
export class UpdateTransferComponent implements OnInit {
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  languages = ['en', 'de', 'pl', 'fr'];
  destinations = [
    { id: 2, name: 'Hurghada' },
    { id: 3, name: 'Marsa Alam' },
    { id: 4, name: 'Aswan' }
  ];
  transferForm: FormGroup;
  formErrors: FormErrorSummary[] = [];
  transferId!: number;
  isSubmitting = false;

imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  existingImage: string | null = null;
  existingImageError: boolean = false;
  isImageLoading: boolean = false;
  allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  maxFileSize = 5 * 1024 * 1024; // 5MB

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private transferService: TransferService
  ) {
    this.transferForm = this.buildForm();
  }

  ngOnInit() {
    this.transferId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTransfer();
  }

  // =========================
  // Build Form
  // =========================
  private buildForm(): FormGroup {
    return this.fb.group({
      referenceName: ['', Validators.required],
      isActive: [true],
      fkDestinationId: [2, Validators.required],

      translations: this.fb.group({
        en: this.createTranslationGroup(),
        de: this.createTranslationGroup(),
        pl: this.createTranslationGroup(),
        fr: this.createTranslationGroup()
      }),

      prices: this.fb.group({
        en: this.fb.array([]),
        de: this.fb.array([]),
        pl: this.fb.array([]),
        fr: this.fb.array([])
      }),

      includes: this.fb.group({
        en: this.fb.array([]),
        de: this.fb.array([]),
        pl: this.fb.array([]),
        fr: this.fb.array([])
      }),

      notIncludes: this.fb.group({
        en: this.fb.array([]),
        de: this.fb.array([]),
        pl: this.fb.array([]),
        fr: this.fb.array([]),

      }),

      highlights: this.fb.group({
        en: this.fb.array([]),
        de: this.fb.array([]),
        pl: this.fb.array([]),
        fr: this.fb.array([])
      })
    });
  }

  private createTranslationGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      metaDescription: [''],
      metaKeyWords: ['']
    });
  }

  // =========================
  // FormArray Getters
  // =========================
  getTranslationGroup(lang: string) {
    return this.transferForm.get(['translations', lang]) as FormGroup;
  }

  getPrices(lang: string): FormArray {
    return this.transferForm.get(['prices', lang]) as FormArray;
  }

  getIncludes(lang: string): FormArray {
    return this.transferForm.get(['includes', lang]) as FormArray;
  }

  getNotIncludes(lang: string): FormArray {
    return this.transferForm.get(['notIncludes', lang]) as FormArray;
  }

  getHighlights(lang: string): FormArray {
    return this.transferForm.get(['highlights', lang]) as FormArray;
  }

  // =========================
  // Load transfer & patch
  // =========================
  loadTransfer() {
    this.transferService.getAllDetaildedTransfers(this.transferId).subscribe({
      next: (res) => {
        this.patchBasicData(res);
        this.patchTranslations(res.translations);
        this.patchPrices(res.pricesList);
        this.patchText(res.includeds, 'includes');
        this.patchText(res.notIncludeds, 'notIncludes');
        this.patchText(res.highlights, 'highlights');

        if (res.imageCover) {
          this.existingImage = `${environment.BaseUrl}/${res.imageCover}`;
          this.imagePreview = this.existingImage;
        }
      },
      error: (error) => {
        console.error('Error loading transfer:', error);
        this.toaster.error('Failed to load transfer data', 'Error');
        this.router.navigate(['/admin/transfers']);
      }
    });
  }

  private patchBasicData(data: any) {
    this.transferForm.patchValue({
      referenceName: data.referneceName,
      isActive: data.isActive,
      fkDestinationId: data.fK_DestinationID
    });
  }

  private patchTranslations(translations: any[]) {
    this.languages.forEach(lang => {
      const tr = translations.find(t => t.language === lang);
      if (tr) {
        this.getTranslationGroup(lang).patchValue({
          name: tr.name,
          description: tr.description,
          metaDescription: tr.metaDescription || '',
          metaKeyWords: tr.metaKeyWords || ''
        });
      }
    });
  }

  private patchPrices(prices: any[]) {
    this.languages.forEach(lang => {
      const arr = this.getPrices(lang);
      arr.clear();
      prices.filter(p => p.language === lang).forEach(p => {
        arr.push(this.fb.group({
          id: [p.id],
          title: [p.title, Validators.required],
          privtePrice: [p.privtePrice, Validators.required],
          sharedPrice: [p.sharedPrice, Validators.required],
          Language: [lang]
        }));
      });
    });
  }

  private patchText(list: any[], key: 'includes' | 'notIncludes' | 'highlights') {
    this.languages.forEach(lang => {
      const arr = this.transferForm.get([key, lang]) as FormArray;
      arr.clear();
      list.filter(x => x.language === lang).forEach(x => {
        arr.push(this.fb.group({
          id: [x.id],
          text: [x.text, Validators.required],
          Language: [lang]
        }));
      });
    });
  }

  // =========================
  // Add / Remove
  // =========================
  addPrice(lang: string) {
    this.getPrices(lang).push(this.fb.group({
      title: ['', Validators.required],
      privtePrice: [0, Validators.required],
      sharedPrice: [0, Validators.required],
      Language: [lang]
    }));
  }

  removePrice(lang: string, index: number) {
    this.getPrices(lang).removeAt(index);
  }

  addInclude(lang: string) {
    this.getIncludes(lang).push(this.fb.group({
      text: ['', Validators.required],
      Language: [lang]
    }));
  }

  removeInclude(lang: string, index: number) {
    this.getIncludes(lang).removeAt(index);
  }

  addNotInclude(lang: string) {
    this.getNotIncludes(lang).push(this.fb.group({
      text: ['', Validators.required],
      Language: [lang]
    }));
  }

  removeNotInclude(lang: string, index: number) {
    this.getNotIncludes(lang).removeAt(index);
  }

  addHighlight(lang: string) {
    this.getHighlights(lang).push(this.fb.group({
      text: ['', Validators.required],
      Language: [lang]
    }));
  }

  removeHighlight(lang: string, index: number) {
    this.getHighlights(lang).removeAt(index);
  }

  // =========================
  // Image
  // =========================
  onFileSelected(event: any) {
    if (!event.target.files?.length) return;
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = this.existingImage;
    this.fileInput.nativeElement.value = '';
  }

  // =========================
  // Error Summary
  // =========================
  buildErrorSummary() {
    this.formErrors = [];

    this.checkControl('referenceName', 'Reference Name');
    this.checkControl('fkDestinationId', 'Destination');

    this.languages.forEach(lang => {
      const group = this.getTranslationGroup(lang);
      if (group.get('name')?.invalid && group.get('name')?.touched)
        this.formErrors.push({ label: 'Name', lang });
      if (group.get('description')?.invalid && group.get('description')?.touched)
        this.formErrors.push({ label: 'Description', lang });
      if (group.get('metaKeyWords')?.invalid && group.get('metaKeyWords')?.touched)
        this.formErrors.push({ label: 'Meta Keywords', lang });
      if (group.get('metaDescription')?.invalid && group.get('metaDescription')?.touched)
        this.formErrors.push({ label: 'Meta Description', lang });
    });
  }

  private checkControl(controlName: string, label: string) {
    const control = this.transferForm.get(controlName);
    if (control && control.invalid && control.touched)
      this.formErrors.push({ label });
  }

  // =========================
  // Submit Update
  // =========================
  onSubmit() {
    this.transferForm.markAllAsTouched();
    this.buildErrorSummary();

    if (this.transferForm.invalid) {
      this.toaster.error('Please complete all required fields correctly', 'Validation Error');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('ReferneceName', this.transferForm.value.referenceName);
    formData.append('IsActive', this.transferForm.value.isActive);
    formData.append('FK_DestinationID', this.transferForm.value.fkDestinationId);

    formData.append('TranslationsJson', JSON.stringify(this.buildTranslations()));
    formData.append('PriecesListJson', JSON.stringify(this.collectPrices()));
    formData.append('IncludesJson', JSON.stringify(this.collectText('includes')));
    formData.append('NonIncludesJson', JSON.stringify(this.collectText('notIncludes')));
    formData.append('hightlightJson', JSON.stringify(this.collectText('highlights')));

    if (this.selectedFile) formData.append('ImageFile', this.selectedFile);

    this.transferService.updateTransfer(this.transferId, formData).subscribe({
      next: () => {
        this.toaster.success('Transfer updated successfully', 'Success');
        this.router.navigate(['/admin/transfers']);
      },
      error: (error) => {
        console.error('Error updating transfer:', error);
        this.toaster.error('Error updating transfer. Please try again.', 'Error');
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  // =========================
  // Collect Data
  // =========================
  private buildTranslations() {
    return this.languages.map(lang => {
      const tr = this.getTranslationGroup(lang).value;
      return { 
        Language: lang, 
        Name: tr.name, 
        Description: tr.description, 
        MetaDescription: tr.metaDescription, 
        MetaKeyWords: tr.metaKeyWords 
      };
    });
  }

  private collectPrices(): any[] {
    const result: any[] = [];
    this.languages.forEach(lang => {
      this.getPrices(lang).value.forEach((p: any) => {
        result.push({
          Id: p.id || 0,
          Title: p.title,
          PrivtePrice: p.privtePrice,
          SharedPrice: p.sharedPrice,
          Language: lang
        });
      });
    });
    return result;
  }

  private collectText(key: 'includes' | 'notIncludes' | 'highlights'): any[] {
    const result: any[] = [];
    this.languages.forEach(lang => {
      this.transferForm.get([key, lang])?.value.forEach((item: any) => {
        result.push({ Id: item.id || 0, Text: item.text, Language: lang });
      });
    });
    return result;
  }
}