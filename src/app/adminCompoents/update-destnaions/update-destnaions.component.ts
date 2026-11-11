import { Router } from '@angular/router';
import { DestnatoinService } from './../../core/services/destnatoin.service';
import { Component, ElementRef, inject, numberAttribute, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgClass } from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-destnaions',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass,CommonModule],
  templateUrl: './update-destnaions.component.html',
  styleUrl: './update-destnaions.component.css'
})
export class UpdateDestnaionsComponent {
  private readonly toasterService = inject(ToastrService);
    private readonly _router=inject(Router);
  

  destForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null; // صورة جديدة فقط
  oldImageUrl: string | null = null;                // صورة قديمة فقط
  newImageFile: File | null = null;
  

  constructor(
    private fb: FormBuilder, 
    private destService: DestnatoinService, 
    private route: ActivatedRoute
  ) {
    this.destForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      metaDescription: ['', Validators.required],
      metaKeyWords: ['', Validators.required],
      referenceName: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.destService.getDetaildedDestantion(id).subscribe(dest => {
  
        // خزّن الصورة القديمة فقط
        this.oldImageUrl = dest.imageCover;
  
        // تأكد إن preview = null عند بداية الصفحة
        this.imagePreview = null;
  
        this.destForm.patchValue({
          title: dest.title,
          description: dest.description,
          metaDescription: dest.metaDescription,
          metaKeyWords: dest.metaKeyWords,
          referenceName: dest.referenceName,
          isActive: dest.isActive
        });
      });
    }
  }
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
  
    this.newImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string; // عرض الصورة الجديدة
    };
    reader.readAsDataURL(file);
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  removeImage() {
    this.imagePreview = null;
    this.newImageFile = null;
  
    // أهم خطوة
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onSubmit() {
    if (this.destForm.invalid) {
      this.toasterService.error('All form fields must be filled out before submitting.', 'Form Validation');
      return
    };

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const formData = new FormData();

    // بيانات النصوص
    Object.entries(this.destForm.value).forEach(([key, value]: any) => {
      formData.append(key, value);
    });

    // صورة جديدة فقط لو المستخدم اختار
    if (this.newImageFile) {
      formData.append('ImageFile', this.newImageFile);
    }

    this.destService.updateDestantion(id, formData).subscribe({
      next: () => {
        this.toasterService.success("This Destination Updated Successfully", 'Update Sent');
        this._router.navigate(['/admin/destnaions']);

      },
      error: () => {
        this.toasterService.error(
          "There was an error updating the destination. Please try again later.",
          'Update Error'
        );
      }
    });
  }
}
