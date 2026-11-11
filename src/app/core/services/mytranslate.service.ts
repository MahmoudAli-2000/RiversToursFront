// import { TranslateService } from '@ngx-translate/core';
// import { isPlatformBrowser } from '@angular/common';
// import { inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';


// @Injectable({
//   providedIn: 'root'
// })
// export class MytranslateService {

//   private readonly translateService =inject(TranslateService);
//   private readonly platid=inject(PLATFORM_ID);
//   private readonly render2=inject(RendererFactory2).createRenderer(null,null);


//   constructor() { 

//     if(isPlatformBrowser(this.platid)){
//       // save lang in local storage
//    let savedLang =localStorage.getItem('lang');
    
//    // set default lang
//    this.translateService.setDefaultLang('en');

//    // use saved lang if exist
  
//     this.translateService.use(savedLang? savedLang:'en');

//     }
    
//   }
//   ChangeLanguage(lang:string):void{
//     if(isPlatformBrowser(this.platid)){ 
//       this.translateService.use(lang);
//       localStorage.setItem('lang',lang);
//     }
   
//   }}
