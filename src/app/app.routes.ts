import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotfoundComponent } from './clientComponents/notfound/notfound.component';
import { HomeComponent } from './clientComponents/home/home.component';
import { TransferComponent } from './clientComponents/transfer/transfer.component';
import { DestnationsComponent } from './clientComponents/destnations/destnations.component';
import { FaqComponent } from './clientComponents/faq/faq.component';
import { ServicesComponent } from './clientComponents/services/services.component';
import { LoginComponent } from './adminCompoents/login/login.component';
import { UsersComponent } from './adminCompoents/users/users.component';
import { RegisterComponent } from './adminCompoents/register/register.component';
import { TOurDetailComponent } from './clientComponents/tour-detail/tour-detail.component';
import { TransfersDetailComponent } from './clientComponents/transfers-detail/transfers-detail.component';
import { DesntationDetailComponent } from './clientComponents/desntation-detail/desntation-detail.component';
import { CategoryTourDetailComponent } from './clientComponents/category-tour-detail/category-tour-detail.component';
import { ToursAdComponent } from './adminCompoents/tours-ad/tours-ad.component';
import { EmailAdComponent } from './adminCompoents/email-ad/email-ad.component';
import { CategorytourAdComponent } from './adminCompoents/categorytour-ad/categorytour-ad.component';
import { DestnationAdComponent } from './adminCompoents/destnation-ad/destnation-ad.component';
import { TrasnfersAdComponent } from './adminCompoents/trasnfers-ad/trasnfers-ad.component';
import { CreateTourComponent } from './adminCompoents/create-tour/create-tour.component';
import { UpdateTourComponent } from './adminCompoents/update-tour/update-tour.component';
import { CreateDestnaionsComponent } from './adminCompoents/create-destnaions/create-destnaions.component';
import { UpdateDestnaionsComponent } from './adminCompoents/update-destnaions/update-destnaions.component';
import { CreateCatTourComponent } from './adminCompoents/create-cat-tour/create-cat-tour.component';
import { UpdateCatTourComponent } from './adminCompoents/update-cat-tour/update-cat-tour.component';
import { CreateTransferComponent } from './adminCompoents/create-transfer/create-transfer.component';
import { UpdateTransferComponent } from './adminCompoents/update-transfer/update-transfer.component';
import { authGuardGuard } from './core/guards/auth-guard.guard';
import { AboutComponent } from './clientComponents/about/about.component';
import { ReviewsComponent } from './clientComponents/reviews/reviews.component';
import { BlogsComponent } from './clientComponents/blogs/blogs.component';
import { HurghadablogsComponent } from './clientComponents/hurghadablogs/hurghadablogs.component';
import { LuxorblogComponent } from './clientComponents/luxorblog/luxorblog.component';
import { logedGuard } from './core/guards/loged.guard';
export const routes: Routes = [
    {
      path: '',
      loadComponent: () => import('./layouts/client-layout/client-layout.component').then(m => m.ClientLayoutComponent),
      children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', loadComponent: () => import('./clientComponents/home/home.component').then(m => m.HomeComponent) },
        { path: 'vacationhome', loadComponent: () => import('./clientComponents/vacationhome/vacationhome.component').then(m => m.VacationhomeComponent) },
        { path: 'vacationhome/:slug', loadComponent: () => import('./clientComponents/vacationhomedetail/vacationhomedetail.component').then(m => m.VacationhomedetailComponent) },
        { path: 'transfer', loadComponent: () => import('./clientComponents/transfer/transfer.component').then(m => m.TransferComponent) },
        { path: 'tourDetail/:slug', loadComponent: () => import('./clientComponents/tour-detail/tour-detail.component').then(m => m.TOurDetailComponent) },
        { path: 'transferDetail/:slug', loadComponent: () => import('./clientComponents/transfers-detail/transfers-detail.component').then(m => m.TransfersDetailComponent) },
        { path: 'categrytourDetail/:slug', loadComponent: () => import('./clientComponents/category-tour-detail/category-tour-detail.component').then(m => m.CategoryTourDetailComponent) },
        { path: 'reviews', loadComponent: () => import('./clientComponents/reviews/reviews.component').then(m => m.ReviewsComponent) },
        { path: 'hurghadaBlog', loadComponent: () => import('./clientComponents/hurghadablogs/hurghadablogs.component').then(m => m.HurghadablogsComponent) },
        { path: 'luxorBlog', loadComponent: () => import('./clientComponents/luxorblog/luxorblog.component').then(m => m.LuxorblogComponent) },
        { path: 'blogs', loadComponent: () => import('./clientComponents/blogs/blogs.component').then(m => m.BlogsComponent) },
        { path: 'about', loadComponent: () => import('./clientComponents/about/about.component').then(m => m.AboutComponent) }

      ]
    },
    {
      path: 'admin',
      loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
      children: [
        { path: 'login', loadComponent: () => import('./adminCompoents/login/login.component').then(m => m.LoginComponent), canActivate: [logedGuard], title: 'Login' },
        { path: 'register', loadComponent: () => import('./adminCompoents/register/register.component').then(m => m.RegisterComponent), title: 'Register' },
  
        { path: 'tours', loadComponent: () => import('./adminCompoents/tours-ad/tours-ad.component').then(m => m.ToursAdComponent), canActivate: [authGuardGuard], title: 'Tours Dashboard' },
        { path: 'vacationhomes', loadComponent: () => import('./adminCompoents/vacationhomes-ad/vacationhomes-ad.component').then(m => m.VacationhomesAdComponent), canActivate: [authGuardGuard], title: 'Vacation Homes' },
        { path: 'categorytour', loadComponent: () => import('./adminCompoents/categorytour-ad/categorytour-ad.component').then(m => m.CategorytourAdComponent), canActivate: [authGuardGuard], title: 'Category Tour Dashboard' },
        { path: 'destnaions', loadComponent: () => import('./adminCompoents/destnation-ad/destnation-ad.component').then(m => m.DestnationAdComponent), canActivate: [authGuardGuard], title: 'Destnaions Dashboard' },
        { path: 'transfers', loadComponent: () => import('./adminCompoents/trasnfers-ad/trasnfers-ad.component').then(m => m.TrasnfersAdComponent), canActivate: [authGuardGuard], title: 'Transfers Dashboard' },
  
        { path: 'emails', loadComponent: () => import('./adminCompoents/email-ad/email-ad.component').then(m => m.EmailAdComponent), canActivate: [authGuardGuard], title: 'Emails' },
        { path: 'vacationhome-emails', loadComponent: () => import('./adminCompoents/vacationhome-email-ad/vacationhome-email-ad.component').then(m => m.VacationhomeEmailAdComponent), canActivate: [authGuardGuard], title: 'Vacation Home Bookings' },
        { path: 'users', loadComponent: () => import('./adminCompoents/users/users.component').then(m => m.UsersComponent), canActivate: [authGuardGuard], title: 'Users' },
  
        { path: 'tourCreate', loadComponent: () => import('./adminCompoents/create-tour/create-tour.component').then(m => m.CreateTourComponent), canActivate: [authGuardGuard], title: 'Admin Create a Tour' },
        { path: 'tourUpdate/:id', loadComponent: () => import('./adminCompoents/update-tour/update-tour.component').then(m => m.UpdateTourComponent), canActivate: [authGuardGuard], title: 'Admin Update a Tour' },
        { path: 'vacationhomeCreate', loadComponent: () => import('./adminCompoents/create-vacationhome/create-vacationhome.component').then(m => m.CreateVacationhomeComponent), canActivate: [authGuardGuard], title: 'Create Vacation Home' },
        { path: 'vacationhomeUpdate/:id', loadComponent: () => import('./adminCompoents/update-vacationhome/update-vacationhome.component').then(m => m.UpdateVacationhomeComponent), canActivate: [authGuardGuard], title: 'Update Vacation Home' },
  
        { path: 'destnationCreate', loadComponent: () => import('./adminCompoents/create-destnaions/create-destnaions.component').then(m => m.CreateDestnaionsComponent), canActivate: [authGuardGuard], title: 'Admin Create a Destnation' },
        { path: 'destnationUpdate/:id', loadComponent: () => import('./adminCompoents/update-destnaions/update-destnaions.component').then(m => m.UpdateDestnaionsComponent), canActivate: [authGuardGuard], title: 'Admin Update a Destnation' },
  
        { path: 'catTourCreate', loadComponent: () => import('./adminCompoents/create-cat-tour/create-cat-tour.component').then(m => m.CreateCatTourComponent), canActivate: [authGuardGuard], title: 'Admin Create a Category Tour' },
        { path: 'catTourUpdate/:id', loadComponent: () => import('./adminCompoents/update-cat-tour/update-cat-tour.component').then(m => m.UpdateCatTourComponent), canActivate: [authGuardGuard], title: 'Admin Update a Category Tour' },
  
        { path: 'transferCreate', loadComponent: () => import('./adminCompoents/create-transfer/create-transfer.component').then(m => m.CreateTransferComponent), canActivate: [authGuardGuard], title: 'Admin Create a Transfer' },
        { path: 'transferUpdate/:id', loadComponent: () => import('./adminCompoents/update-transfer/update-transfer.component').then(m => m.UpdateTransferComponent), canActivate: [authGuardGuard], title: 'Admin Update a Transfer' },
  
        { path: '', redirectTo: 'tours', pathMatch: 'full' },
        { path: '**', redirectTo: 'tours' },
      ]
    },
    { path: '**', loadComponent: () => import('./clientComponents/notfound/notfound.component').then(m => m.NotfoundComponent), title: 'Not Found Page' }
  ];
  