

import {ResponseValue} from '../../support/interface'

class LicenseInformation{



    getForm(){
        return cy.get('div.top-container-right').parent()
    }

    getExpirationDate(){
        return this.getForm()
            .contains('License Expiration Date:')
            .parent()
            .find('div.profile-section-value')
    }

    getStatus(){
        return this.getForm()
            .contains('License Status:')
            .parent()
            .find('div.profile-section-value')
    }

    getName(){
        return cy.get('div.full-name')

    }

    getDataByKeys(options: string[] = ['status', 'expiration', "name"]){
        return new Promise((resolve, reject) => {
            let response:ResponseValue = {};
            for(let key of options){
                if(key === 'status'){
                    response.status = this.getStatus();
                }else if(key === 'expiration'){
                    response.expiration = this.getExpirationDate();
                }else if(key === 'name'){
                    response.name = this.getName()
                }
            }
            resolve(response)
        })
    }

}


export {LicenseInformation, ResponseValue}