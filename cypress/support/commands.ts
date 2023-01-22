/// <reference types="cypress" />


// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
declare global {
    namespace Cypress {
        interface Chainable {
            writeToOutput: (data: object) => void;
            licenseSearchRequest: (firstName:string, lastName:string) => Cypress.Chainable<Cypress.Response<any>>
            licenseDataRequest: (licenseNumber:string) => Cypress.Chainable<Cypress.Response<any>>
        }
    }
}


Cypress.Commands.add('writeToOutput', (dataToWrite:object):void => {
    cy.readFile(Cypress.env('pathToOutput')).then(fileData => {
        fileData.push(dataToWrite)
        cy.writeFile(Cypress.env('pathToOutput'), fileData)
    })
})

Cypress.Commands.add('licenseSearchRequest', (firstName:string, lastName:string) => {
    return cy.request({
        method: 'POST',
        url: "search",
        failOnStatusCode: true,
        body: {
            "licenseMetaId": null,
            "firstName": firstName,
            "lastName": lastName,
            "specialties": [],
            "cities": [],
            "searchType": "BY_PHYSICIAN_NAME"
        }
    })
})

Cypress.Commands.add('licenseDataRequest', (licenseNumber:string) => {
    return cy.request({
        method: "GET",
        failOnStatusCode: true,
        url: `search/physician-profiles/${licenseNumber}`
    })
})

export {}