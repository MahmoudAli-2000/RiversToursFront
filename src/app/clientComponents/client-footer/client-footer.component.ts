import { Component } from '@angular/core';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-client-footer',
  standalone: true,
  imports: [TranslatedPipe],
  templateUrl: './client-footer.component.html',
  styleUrl: './client-footer.component.css'
})
export class ClientFooterComponent {

}
