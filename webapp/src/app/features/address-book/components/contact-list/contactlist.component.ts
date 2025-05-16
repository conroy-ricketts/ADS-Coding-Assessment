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
    <button (click)="showAddForm = !showAddForm">{{ showAddForm ? 'Cancel' : 'Add Contact' }}</button>
    <div *ngIf="showAddForm">
      <h3>Add Contact</h3>
      <form (ngSubmit)="addContact()">
        <strong>Required Fields</strong><br>
        <input [(ngModel)]="newContact.ContactName" name="ContactName" placeholder="Name" required /><br>
        <input [(ngModel)]="newContact.CustomerID" name="CustomerID" placeholder="Customer ID" required /><br>
        <strong>Optional Fields</strong><br>
        <input [(ngModel)]="newContact.CompanyName" name="CompanyName" placeholder="Company Name" /><br> 
        <input [(ngModel)]="newContact.Address" name="Address" placeholder="Address" /><br>
        <input [(ngModel)]="newContact.City" name="City" placeholder="City" /><br>
        <input [(ngModel)]="newContact.Country" name="Country" placeholder="Country" /><br>
        <input [(ngModel)]="newContact.Email" name="Email" placeholder="Email" /><br>
        <input [(ngModel)]="newContact.Phone" name="Phone" placeholder="Phone" /><br>
        <input [(ngModel)]="newContact.Fax" name="Fax" placeholder="Fax" /><br>
        <input [(ngModel)]="newContact.Region" name="Region" placeholder="Region" /><br>
        <input [(ngModel)]="newContact.ContactTitle" name="ContactTitle" placeholder="Title" /><br>
        <input [(ngModel)]="newContact.PostalCode" name="PostalCode" placeholder="Postal Code" /><br>
        <button type="submit">Save</button>
      </form>
    </div>
    <body *ngFor="let contact of filteredContacts()">
      <div *ngIf="editID !== contact.CustomerID">
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
        <button (click)="startEdit(contact)">Edit</button>
        <button (click)="deleteContact(contact.CustomerID)">Delete</button>
      </div>
      <div *ngIf="editID === contact.CustomerID">
        <form (ngSubmit)="updateContact()">
        <strong>Required Fields</strong><br>
          <input [(ngModel)]="editContact.ContactName" name="editContactName" placeholder="Name" required /><br>
          <input [(ngModel)]="editContact.CustomerID" name="editCustomerID" placeholder="Customer ID" required /><br>
          <strong>Optional Fields</strong><br>
          <input [(ngModel)]="editContact.CompanyName" name="editCompanyName" placeholder="Company Name" /><br> 
          <input [(ngModel)]="editContact.Address" name="editAddress" placeholder="Address" /><br>
          <input [(ngModel)]="editContact.City" name="editCity" placeholder="City" /><br>
          <input [(ngModel)]="editContact.Country" name="editCountry" placeholder="Country" /><br>
          <input [(ngModel)]="editContact.Email" name="editEmail" placeholder="Email" /><br>
          <input [(ngModel)]="editContact.Phone" name="editPhone" placeholder="Phone" /><br>
          <input [(ngModel)]="editContact.Fax" name="editFax" placeholder="Fax" /><br>
          <input [(ngModel)]="editContact.Region" name="editRegion" placeholder="Region" /><br>
          <input [(ngModel)]="editContact.ContactTitle" name="editContactTitle" placeholder="Title" /><br>
          <input [(ngModel)]="editContact.PostalCode" name="editPostalCode" placeholder="Postal Code" /><br>
          <button type="submit">Update</button>
          <button type="button" (click)="editID = null">Cancel</button>
        </form>
      </div>
    </body>
  `
})

export class ContactListComponent implements OnInit {
  contacts: Contact[] = []
  queryString: string = ''
  showAddForm: boolean = false
  newContact: Contact = {} as Contact
  editID: string | null = null
  editContact: Contact = {} as Contact

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

  // Method to add a new contact to the list.
  addContact() {
    this.contactService.addContact({ ...this.newContact })
    this.showAddForm = false
    this.newContact = {} as Contact
  }

  // Method to update an existing contact in the list.
  updateContact() {
    this.contactService.updateContact(this.editContact)
    this.editID = null
  }

  // Method to start editing a contact.
  startEdit(contact: Contact) {
    this.editID = contact.CustomerID;
    this.editContact = { ...contact };
  }

  // Method to delete a contact from the list (by customer ID).
  deleteContact(customerID: string) {
    this.contactService.deleteContact(customerID)
  }
}