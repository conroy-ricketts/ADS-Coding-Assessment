import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

// Note that some contacts may not have a fax or region.
export interface Contact {
  CustomerID: string
  CompanyName: string
  ContactName: string
  ContactTitle: string
  Address: string
  City: string
  Email: string
  PostalCode: string
  Country: string
  Phone: string
  Fax?: string
  Region?: string
}

// This service is responsible for fetching the source list of contact data from the XML file, and basic CRUD operations.
@Injectable({ providedIn: 'root' })
export class ContactService {
  private contactsBehaviorSubject = new BehaviorSubject<Contact[]>([])

  constructor(private httpClient: HttpClient) {
    this.loadContacts()
  }

  // Method to fetch the source XML file and parse it into a list of contacts.
  loadContacts() {
    // Load the raw XML file as a string.
    this.httpClient.get('assets/ab.xml', { responseType: 'text' }).pipe(
      // Map the raw XML string to a list of contacts.
      map(xmlStr => {
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

        return contacts
      })
    ).subscribe(contacts => this.contactsBehaviorSubject.next(contacts))
  }

  // Method to get the current list of contacts as an observable.
  getContacts(): Observable<Contact[]> {
    return this.contactsBehaviorSubject.asObservable()
  }

  // Method to add a new contact to the list.
  addContact(contact: Contact) {
    const contacts = this.contactsBehaviorSubject.getValue()
    this.contactsBehaviorSubject.next([contact, ...contacts])
  }

  // Method to update an existing contact in the list (by customer ID).
  updateContact(updatedContact: Contact) {
    const contacts = this.contactsBehaviorSubject.getValue().map(contact =>
      contact.CustomerID === updatedContact.CustomerID ? updatedContact : contact
    )
    this.contactsBehaviorSubject.next(contacts)
  }

  // Method to delete a contact from the list (by customer ID).
  deleteContact(customerId: string) {
    const contacts = this.contactsBehaviorSubject.getValue().filter(contact =>
      contact.CustomerID !== customerId
    )
    this.contactsBehaviorSubject.next(contacts)
  }
}