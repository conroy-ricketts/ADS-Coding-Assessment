import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Contact, ContactService } from '../../contact.service'

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <h1>Contacts</h1>
    <input [(ngModel)]="queryString" placeholder="Filter by either contact name or company name" />
    <body *ngFor="let contact of filteredContacts()">
      <h2>{{ contact.ContactName }}</h2>
      <strong>Company:</strong> {{ contact.CompanyName }}<br>
      <strong>Address:</strong> {{ contact.Address }}<br>
      <strong>City:</strong> {{ contact.City }}<br>
      <strong>Country:</strong> {{ contact.Country }}<br>
      <strong>Email:</strong> {{ contact.Email }}<br>
      <strong>Phone:</strong> {{ contact.Phone }}<br>
      <strong>Fax:</strong> {{ contact.Fax }}<br>
      <strong>Region:</strong> {{ contact.Region }}<br>
      <strong>Customer ID:</strong> {{ contact.CustomerID }}<br>
      <strong>Contact Title:</strong> {{ contact.ContactTitle }}<br>
      <strong>Postal Code:</strong> {{ contact.PostalCode }}<br>
    </body>
  `
})

export class ContactListComponent implements OnInit {
  // Store a list of contacts retrieved from the contact service.
  contacts: Contact[] = []

  // Store the filter query string for searching the list of contacts.
  queryString = ''

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    // Subscribe to the contact service to get the list of contacts.
    this.contactService.getContacts().subscribe(data => this.contacts = data)
  }

  // Method to filter and return the matching list of contacts based on the user's query string.
  filteredContacts() {
    const searchConstraint = this.queryString.toLowerCase()

    // For now, we will just filter by the contact name and company name.
    return this.contacts.filter(contact =>
      contact.ContactName.toLowerCase().includes(searchConstraint) ||
      contact.CompanyName.toLowerCase().includes(searchConstraint)
    )
  }
}