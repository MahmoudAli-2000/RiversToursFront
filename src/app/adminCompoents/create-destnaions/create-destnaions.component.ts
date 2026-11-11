import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DestnatoinService } from './../../core/services/destnatoin.service';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { NgClass } from "@angular/common";
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-create-destnaions',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './create-destnaions.component.html',
  styleUrl: './create-destnaions.component.css'
})
export class CreateDestnaionsComponent {

  private readonly destnationservice=inject(DestnatoinService);
  private readonly toasterService=inject(ToastrService)
  private readonly _router=inject(Router);



  destForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;


  constructor(private fb: FormBuilder, private CatTourService: DestnatoinService) {
    this.destForm = this.fb.group({
      title: ['', Validators.required],
      description: ['',Validators.required],
      metaDescription: ['',Validators.required],
      metaKeyWords: ['',Validators.required],
      referenceName: ['',Validators.required],
      isActive: [true]
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
  
      const reader = new FileReader();
      if (this.selectedFile) {   // ← هنا نضيف check
        reader.onload = () => this.imagePreview = reader.result;
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }
  
  onSubmit() {
    if (this.destForm.invalid) {
      this.toasterService.error('All form fields must be filled out before submitting.', 'Form Validation');
      return
    };

    const formData = new FormData();
    formData.append('Title', this.destForm.get('title')?.value);
    formData.append('Description', this.destForm.get('description')?.value);
    formData.append('MetaDescription', this.destForm.get('metaDescription')?.value);
    formData.append('MetaKeyWords', this.destForm.get('metaKeyWords')?.value);
    formData.append('ReferenceName', this.destForm.get('referenceName')?.value);
    formData.append('IsActive', this.destForm.get('isActive')?.value);

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.CatTourService.createDestantion(formData).subscribe({
      next:(res)=>{
        this.toasterService.success("New Destnation Created Successfully", 'Creation Sent');
        this.destForm.reset();
         this._router.navigate(['/admin/destnaions']);

           }
      ,
      error:(err:HttpErrorResponse)=>{
        this.toasterService.error("There was an error to create new destnaion. Please try again later.", 'Creation Error');
      }
    });
  }
  @ViewChild('fileInput') fileInput!: ElementRef;

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';

  }
  

}
