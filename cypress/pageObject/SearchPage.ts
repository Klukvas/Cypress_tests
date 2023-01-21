

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
    

    checkIfLicenseExists(){
        return cy.get('app-header').next().then(globalContainer => {
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

    getFullName(){
        //if we are here, then there is only 1 license entry
        this.getLicense().as('licenseRow');
        return cy.get('@licenseRow')
                .find('div[col-id=fullName]')
                .find('span')
                .invoke('text')
    }

    getLicenseNum(){
        //if we are here, then there is only 1 license entry
        this.getLicense().as('licenseRow');
        return cy.get('@licenseRow')
                .find('div[col-id=licenseNumber]')
                .find('a[class="page-link ng-star-inserted"]')
                .invoke('text')
    }
   

}

export {SearchForm, SearchGrid}
