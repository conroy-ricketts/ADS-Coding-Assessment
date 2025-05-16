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
    <button (click)="exportContacts()">Export Contacts</button>
    <input type="file" accept=".xml" (change)="importContacts($event)" style="margin-left:10px" /> <br>
    <input [(ngModel)]="queryString" placeholder="Filter by either contact name or company name" />
    <button (click)="showAddForm = !showAddForm">{{ showAddForm ? 'Cancel' : 'Add Contact' }}</button>
    <div *ngIf="showAddForm">
      <h3>Add Contact</h3>
      <form (ngSubmit)="addContact()">
        <strong>Required Fields</strong><br>
        <input [(ngModel)]="newContact.ContactName" name="ContactName" placeholder="Name" required /><br>
        <input [(ngModel)]="newContact.CustomerID" name="CustomerID" placeholder="Customer ID" required /><br>
        <input [(ngModel)]="newContact.CompanyName" name="CompanyName" placeholder="Company Name" required /><br> 
        <input [(ngModel)]="newContact.Address" name="Address" placeholder="Address" required /><br>
        <input [(ngModel)]="newContact.City" name="City" placeholder="City" required /><br>
        <input [(ngModel)]="newContact.Country" name="Country" placeholder="Country" required /><br>
        <input [(ngModel)]="newContact.Email" name="Email" placeholder="Email" required /><br>
        <input [(ngModel)]="newContact.Phone" name="Phone" placeholder="Phone" required /><br>
        <input [(ngModel)]="newContact.ContactTitle" name="ContactTitle" placeholder="Title" required /><br>
        <input [(ngModel)]="newContact.PostalCode" name="PostalCode" placeholder="Postal Code" required /><br>
        <strong>Optional Fields</strong><br>
        <input [(ngModel)]="newContact.Fax" name="Fax" placeholder="Fax" /><br>
        <input [(ngModel)]="newContact.Region" name="Region" placeholder="Region" /><br>
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
          <input [(ngModel)]="editContact.CompanyName" name="editCompanyName" placeholder="Company Name" required /><br> 
          <input [(ngModel)]="editContact.Address" name="editAddress" placeholder="Address" required /><br>
          <input [(ngModel)]="editContact.City" name="editCity" placeholder="City" required /><br>
          <input [(ngModel)]="editContact.Country" name="editCountry" placeholder="Country" required /><br>
          <input [(ngModel)]="editContact.Email" name="editEmail" placeholder="Email" required /><br>
          <input [(ngModel)]="editContact.Phone" name="editPhone" placeholder="Phone" required /><br>
          <input [(ngModel)]="editContact.ContactTitle" name="editContactTitle" placeholder="Title" required /><br>
          <input [(ngModel)]="editContact.PostalCode" name="editPostalCode" placeholder="Postal Code" required /><br>
          <strong>Optional Fields</strong><br>
          <input [(ngModel)]="editContact.Fax" name="editFax" placeholder="Fax" /><br>
          <input [(ngModel)]="editContact.Region" name="editRegion" placeholder="Region" /><br>
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
    this.editID = contact.CustomerID
    this.editContact = { ...contact }
  }

  // Method to delete a contact from the list (by customer ID).
  deleteContact(customerID: string) {
    this.contactService.deleteContact(customerID)
  }

  // Method to export the contacts to an XML file.
  exportContacts() {
    const xmlString = this.contactsToXML(this.contacts)
    const blob = new Blob([xmlString], { type: 'application/xml' })
    const url = window.URL.createObjectURL(blob)
    const newElement = document.createElement('a')
    newElement.href = url
    newElement.download = 'contacts.xml'
    newElement.click()
    URL.revokeObjectURL(url)
  }

  // Method to convert the contacts to an XML string.
  contactsToXML(contacts: Contact[]): string {
    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<AddressBook>'

    for (const contact of contacts) {
      xmlString += `
        <Contact>
        \t<CustomerID>${this.escapeXml(contact.CustomerID)}</CustomerID>
        \t<CompanyName>${this.escapeXml(contact.CompanyName)}</CompanyName>
        \t<ContactName>${this.escapeXml(contact.ContactName)}</ContactName>
        \t<ContactTitle>${this.escapeXml(contact.ContactTitle)}</ContactTitle>
        \t<Address>${this.escapeXml(contact.Address)}</Address>
        \t<City>${this.escapeXml(contact.City)}</City>
        \t<Email>${this.escapeXml(contact.Email)}</Email>
        \t<PostalCode>${this.escapeXml(contact.PostalCode)}</PostalCode>
        \t<Country>${this.escapeXml(contact.Country)}</Country>
        \t<Phone>${this.escapeXml(contact.Phone)}</Phone>
        `

      if (contact.Fax) {
        xmlString += `\t<Fax>${this.escapeXml(contact.Fax)}</Fax>`
      }

      if (contact.Region) {
        xmlString += `\t<Region>${this.escapeXml(contact.Region)}</Region>`
      }

      xmlString += '\n\t</Contact>'
    }

    xmlString += '\n</AddressBook>'
    return xmlString
  }

  // Method to escape XML special characters.
  escapeXml(str: string | undefined): string { 
    if (!str) {
      return ''
    }

    return str.replace(
        /[<>&'"]/g, 
        subStr => ({
        '<': '&lt;', '>': '&gt;', '&': '&amp;', '\'': '&apos;', '"': '&quot;'
        }[subStr] as string)
    )
  }

  // Method to import contacts from an XML file.
  importContacts(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) {
      return
    }

    const file = input.files[0]
    const reader = new FileReader()

    // Map the raw XML string to a list of contacts.
    reader.onload = () => {
      const xmlStr = reader.result as string
      const parser = new DOMParser()
      const xml = parser.parseFromString(xmlStr, 'application/xml')
      const contacts: Contact[] = []

      // Create each new contact with all the relevant fields.
      xml.querySelectorAll('Contact').forEach(node => {
        contacts.push({
          CustomerID: node.querySelector('CustomerID')?.textContent ?? '',
          CompanyName: node.querySelector('CompanyName')?.textContent ?? '',
          ContactName: node.querySelector('ContactName')?.textContent ?? '',
          ContactTitle: node.querySelector('ContactTitle')?.textContent ?? '',
          Address: node.querySelector('Address')?.textContent ?? '',
          City: node.querySelector('City')?.textContent ?? '',
          Email: node.querySelector('Email')?.textContent ?? '',
          PostalCode: node.querySelector('PostalCode')?.textContent ?? '',
          Country: node.querySelector('Country')?.textContent ?? '',
          Phone: node.querySelector('Phone')?.textContent ?? '',
          Fax: node.querySelector('Fax')?.textContent ?? '',
          Region: node.querySelector('Region')?.textContent ?? ''
        })
      })

      // Replace the current contacts with the imported ones.
      this.contactService.replaceContacts(contacts)
    }
    reader.readAsText(file)

    // Reset the input so the same file can be imported again if needed.
    input.value = ''
  }
}