

import inputJson from '../fixtures/input.json'
import {VerificationError, validateUserDataInput} from '../support/common_utils'
import {CurretTestState} from '../support/interface'
import {SearchResponse} from '../pageObject/Api'


describe('Prove license data', {baseUrl: 'https://api.medboard.mass.gov/api-public/'}, () => {

    let searchResponseProcessor: SearchResponse
    before(() => {
        searchResponseProcessor = new SearchResponse();
    })

    inputJson.forEach((userRecord) => {
        it(`Get data about license of user: ${JSON.stringify( userRecord )}`, () => {
            let res: Array<any> = validateUserDataInput(userRecord)
            if (res.length){
                cy.writeToOutput({error: VerificationError.IncorrectInputData})
            }else{
                cy.licenseSearchRequest(userRecord.firstName, userRecord.lastName).then(resp => {
                    return searchResponseProcessor.processUserLicense(resp, userRecord);
                }).then((searchResult:CurretTestState) => {
                    if(!searchResult.done){
                        return cy.licenseDataRequest(userRecord.licenseNumber).then((licenseDataResponse) => {
                            return searchResponseProcessor.processLicenseData(licenseDataResponse, userRecord)
                        })
                    }
                }).then((licenseData: CurretTestState) => {
                    cy.writeToOutput(licenseData.value)
                    if(licenseData.makeScreenshot){
                        cy.intercept({url:'https://findmydoctor.mass.gov/assets/svg-icons/Seal_of_Massachusetts.svg'})
                            .as('longestReq')
                        cy.visit(`https://findmydoctor.mass.gov/profiles/${userRecord.licenseNumber}`)
                        cy.wait('@longestReq');
                        cy.wait(600) // just for render
                        cy.screenshot(`${JSON.stringify(userRecord)}`, {overwrite: true})
                    }
                    
                })
            }
        })
    })
})