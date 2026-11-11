import { register } from 'swiper/element/bundle';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass, CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgClass, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

    msError:string='';
    Isloading:boolean=false;
    IsSccuess:boolean=false;
    private readonly authService=inject(AuthService);  
    private readonly Router=inject(Router);
    private readonly _formBuilder=inject(FormBuilder);
    private readonly toasterService=inject(ToastrService);


  
    registrationForm:FormGroup=this._formBuilder.group({
      fullName:['', [Validators.required, Validators.minLength(3)]],
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required],
    });

    onSubmit():void{
      if(this.registrationForm.valid)
        {
          this.Isloading=true;
          this.authService.Register(this.registrationForm.value).subscribe({
            next:(res)=>{
                this.IsSccuess=true;
                setTimeout(() => {
                  this.Router.navigate(['/admin/login']);
                }, 1300);
              
              this.Isloading=false;
            },
            error:(err:HttpErrorResponse)=>{     
                 this.toasterService.error("Invalid full name, email or password", 'Invalid Registeration');

            }
            
          })
        }
      else{
          this.registrationForm.markAllAsTouched();
        }
    }

}
