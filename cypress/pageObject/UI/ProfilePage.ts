

import {CurretTestState, ResponseValue, SuccessParsed} from '../../support/interface'
import {prettyString, MonthNum} from '../../support/common_utils' 

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

    parseData(objectWithData:ResponseValue): CurretTestState{
        let resp = {} as SuccessParsed;
        for(let key of Object.keys(objectWithData)){
            if(key == 'status'){
                objectWithData.status.then($status => {
                    resp.licenseStatus = prettyString($status.text())
                  });
            }else if(key === 'expiration'){
                objectWithData.expiration.then($expirationDate => {
                    let expnDate = $expirationDate.text();
                    let dateRegex = /(\w{3,9})\s(\d{2})\,\s(\d{4})/gsi
                    let dataGroup =  dateRegex.exec(expnDate)
                    expect(dataGroup.length).to.be.eq(4)
                    let [month, day, year] = Object.values( dataGroup ).slice(1,4)
                    expnDate = `${MonthNum[prettyString(month)]}/${day}/${year}`
                    resp.expirationDate = expnDate
                  });
            }else if(key === 'name'){
                objectWithData.name.then($fullName => {
                    resp.name = prettyString($fullName.text())
                });
            }else{
                throw Error(`Unsupported key: ${key}`)
            }
        }
        return {done: true, value: resp, makeScreenshot: true}
    }

    /** 
     * @defaultValue ['status', 'expiration', 'name'] 
     * @return return a promise with resolves with the object with keys from the input.
     * Values of keys are Chainable<Element>
    */
    getDataByKeys(options: string[] = ['status', 'expiration', "name"]): Promise<{}>{
        return new Promise((resolve, reject) => {
            let response:ResponseValue = {};
            for(let key of options){
                if(key === 'status'){
                    response.status = this.getStatus();
                }else if(key === 'expiration'){
                    response.expiration = this.getExpirationDate();
                }else if(key === 'name'){
                    response.name = this.getName()
                }else{
                    throw Error(`Unsupported key: ${key}`)
                }
            }
            resolve(response)
        })
    }

}


export {LicenseInformation, ResponseValue}