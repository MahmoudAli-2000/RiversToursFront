import { Component } from '@angular/core';
import { ClientNavComponent } from "../../clientComponents/client-nav/client-nav.component";
import { RouterOutlet } from "@angular/router";
import { ClientFooterComponent } from "../../clientComponents/client-footer/client-footer.component";
import { WhatappComponent } from "../../clientComponents/whatapp/whatapp.component";
import { TokComponent } from "../../clientComponents/tok/tok.component";

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [ClientNavComponent, RouterOutlet, ClientFooterComponent, WhatappComponent, TokComponent],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.css'
})
export class ClientLayoutComponent {

}
