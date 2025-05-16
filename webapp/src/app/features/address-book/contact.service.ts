import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
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

// This service is responsible for fetching the source list of contact data from the XML file.
@Injectable({ providedIn: 'root' })
export class ContactService {

  constructor(private httpClient: HttpClient) { }

  // Method to create an observable which fetches the XML file and parses it into a list of contacts.
  getContacts(): Observable<Contact[]> {
    // Load the raw XML file as a string.
    return this.httpClient.get('assets/ab.xml', { responseType: 'text' }).pipe(
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
    )
  }
}