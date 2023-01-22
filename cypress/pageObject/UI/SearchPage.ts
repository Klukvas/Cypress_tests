
import {CurretTestState, FindDataContainer} from '../../support/interface'
class SearchForm{

    defaultInputId:string = "input#physician-{0}-input"

    inputIdTemplate(id:string):string{
        return `input#physician-${id}-input`
    }

    // fillInput(dataForFill:string, typeOfInput:string){

    // }

    fillFirstName(firstName:string):void{
        cy.get(this.inputIdTemplate("first-name")).type(firstName)
    }

    fillLastName(lastName:string):void{
        cy.get(this.inputIdTemplate("last-name")).type(lastName)
    }

    clickSearchBtn():void{
        cy.get('div.search-criteria-wrapper').find('button.search-button').click()
    }

}


class SearchGrid{
    /**
     * 
        here are 3 variants of response:
        - we found the container with a license {result: true, element: Cypress.Chainable<Element>)}
        - we found the container "with no result"{result: false,element: null}
        - we do not found anything{msg:'test with err msg',element: null,result: false}
     * 
     */
    checkIfLicenseExists(): Cypress.Chainable{
        return cy.get('app-header').next().then((globalContainer):FindDataContainer => {
            if(globalContainer.find('div.no-result-container').length > 0){
                return {
                    result: false,
                    element: null
                }
                
            }
            if(globalContainer.find('div#searchGrid').length > 0){
                return {
                    result: true, 
                    element: globalContainer.find('div[class=ag-full-width-container]')
                }
            }else{
                return { 
                    msg:'Could not find container with no records and container with records',
                    element: null,
                    result: false
                }
            }
        })
    }

    getLicense(){
        return cy.get('div#searchGrid').find('div[ref=eBodyViewport]')
    }
    /**
     * Get full name of license from row of license(after search)
     */
    getFullName(): Cypress.Chainable<string>{
        //if we are here, then there is only 1 license entry
        this.getLicense().as('licenseRow');
        return cy.get('@licenseRow')
                .find('div[col-id=fullName]')
                .find('span')
                .invoke('text')
    }
    /**
     * Get number of license from row of license(after search)
     */
    getLicenseNum(): Cypress.Chainable<string>{
        //if we are here, then there is only 1 license entry
        this.getLicense().as('licenseRow');
        return cy.get('@licenseRow')
                .find('div[col-id=licenseNumber]')
                .find('a[class="page-link ng-star-inserted"]')
                .invoke('text')
    }
   

}

export {SearchForm, SearchGrid}
