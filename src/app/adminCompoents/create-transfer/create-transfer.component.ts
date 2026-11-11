import {
  Component,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransferService } from '../../core/services/transfer.service';
import { CommonModule } from '@angular/common';

interface FormErrorSummary {
  label: string;
  lang?: string;
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  selector: 'app-create-transfer',
  templateUrl: './create-transfer.component.html',
  styleUrls: ['./create-transfer.component.scss']
})
export class CreateTransferComponent {

  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);

  languages = ['en', 'de', 'pl', 'fr'];
  destinations = [
    { id: 2, name: 'Hurghada' },
    { id: 3, name: 'Marsa Alam' },
    { id: 4, name: 'Aswan' }
  ];

  transferForm: FormGroup;
  formErrors: FormErrorSummary[] = [];

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private transferService: TransferService
  ) {
    this.transferForm = this.buildForm();
  }

  // =========================
  // Form Builders
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
        fr: this.fb.array([])

      }),

      highlights: this.fb.group({
        en: this.fb.array([]),
        de: this.fb.array([]),
        pl: this.fb.array([]),
        fr: this.fb.array([])

      }),
    });
  }

  private createTranslationGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      metaDescription: [''],
      metaKeywords: ['']
    });
  }

  // =========================
  // Helpers
  // =========================
  getTranslationGroup(lang: string): FormGroup {
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
  // Add / Remove
  // =========================
  addPrice(lang: string) {
    this.getPrices(lang).push(
      this.fb.group({
        title: ['', Validators.required],
        privtePrice: [0, Validators.required],
        sharedPrice: [0, Validators.required],
        Language: [lang, Validators.required]
      })
    );
  }

  removePrice(lang: string, index: number) {
    this.getPrices(lang).removeAt(index);
  }

  addInclude(lang: string) {
    this.getIncludes(lang).push(
      this.fb.group({
        text: ['', Validators.required],
        Language: [lang, Validators.required]
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
        Language: [lang, Validators.required]
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
        Language: [lang, Validators.required]
      })
    );
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
    reader.onload = () => (this.imagePreview = reader.result);
    if (this.selectedFile) reader.readAsDataURL(this.selectedFile);
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
    this.checkControl('referenceName', 'Reference Name');
    this.checkControl('fkDestinationId', 'Destination');

    this.languages.forEach(lang => {
      const group = this.getTranslationGroup(lang);
      if (group.get('name')?.invalid) this.formErrors.push({ label: 'Title', lang });
      if (group.get('description')?.invalid) this.formErrors.push({ label: 'Description', lang });
      if (group.get('metaDescription')?.invalid) this.formErrors.push({ label: 'Meta Description', lang });
      if (group.get('metaKeywords')?.invalid) this.formErrors.push({ label: 'Meta Keywords', lang });
    });
  }

  private checkControl(controlName: string, label: string) {
    const control = this.transferForm.get(controlName);
    if (control && control.invalid) this.formErrors.push({ label });
  }

  // =========================
  // Submit
  // =========================
  onSubmit() {
    this.buildErrorSummary();

    if (this.transferForm.invalid) {
      this.toaster.error('Please complete required fields', 'Validation Error');
      return;
    }

    const formData = new FormData();

    formData.append('ReferneceName', this.transferForm.value.referenceName);
    formData.append('IsActive', this.transferForm.value.isActive);
    formData.append('FK_DestinationID', this.transferForm.value.fkDestinationId);

    const translations = this.languages.map(lang => ({
      Language: lang,
      Name: this.getTranslationGroup(lang).value.name,
      Description: this.getTranslationGroup(lang).value.description,
      MetaDescription: this.getTranslationGroup(lang).value.metaDescription,
      MetaKeyWords: this.getTranslationGroup(lang).value.metaKeywords
    }));
    formData.append('TranslationsJson', JSON.stringify(translations));

    formData.append('PriecesListJson', JSON.stringify(this.collectPrices()));
    formData.append('IncludesJson', JSON.stringify(this.collectText('includes')));
    formData.append('NonIncludesJson', JSON.stringify(this.collectText('notIncludes')));
    formData.append('hightlightJson', JSON.stringify(this.collectText('highlights')));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.transferService.createTransfer(formData).subscribe({
      next: () => {
        this.toaster.success('Transfer created successfully', 'Success');
        this.transferForm.reset({ isActive: true });
        this.router.navigate(['/admin/transfers']);
      },
      error: () => {
        this.toaster.error('Error creating transfer', 'Error');
      }
    });
  }

  private collectPrices(): any[] {
    const result: any[] = [];
    this.languages.forEach(lang => {
      this.getPrices(lang).value.forEach((p: any) => {
        result.push({
          ReferneceName: '',       // ← قيمة فارغة بدل null
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
        result.push({ Text: item.text, Language: lang });
      });
    });
    return result;
  }

  selectedLang: string = 'en'; // الافتراضي يمكن تغييره

  
}