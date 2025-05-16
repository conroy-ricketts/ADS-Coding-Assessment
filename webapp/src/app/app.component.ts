import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ContactListComponent } from "./features/address-book/components/contact-list/contactlist.component"

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ContactListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'webapp'
}
