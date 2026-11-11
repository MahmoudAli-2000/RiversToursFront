import { Component } from '@angular/core';
import { AdminNavComponent } from "../../adminCompoents/admin-nav/admin-nav.component";
import { RouterOutlet } from "@angular/router";
import { AdminFooterComponent } from "../../adminCompoents/admin-footer/admin-footer.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminNavComponent, RouterOutlet, AdminFooterComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
