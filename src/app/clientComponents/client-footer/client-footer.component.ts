import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-client-footer',
  standalone: true,
  imports: [RouterLink, TranslatedPipe],
  templateUrl: './client-footer.component.html',
  styleUrl: './client-footer.component.css'
})
export class ClientFooterComponent {

}
