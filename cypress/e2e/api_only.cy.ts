

import inputJson from '../fixtures/input.json'
import {prettyString, VerificationError, validateUserDataInput} from '../support/utils'









describe('Prove license data', {baseUrl: 'https://api.medboard.mass.gov/api-public/'}, () => {



    inputJson.forEach((userRecord) => {
        it(`Get data about license of user: ${JSON.stringify( userRecord )}`, () => {
            let res: Array<any> = validateUserDataInput(userRecord)
            if (res.length){
                cy.writeToOutput({error: VerificationError.IncorrectInputData})
            }else{
                cy.request({
                    method: 'POST',
                    url: "search",
                    body: {
                        "licenseMetaId": null,
                        "firstName": userRecord.firstName,
                        "lastName": userRecord.lastName,
                        "specialties": [],
                        "cities": [],
                        "searchType": "BY_PHYSICIAN_NAME"
                    }
                }).then((resp) => {
                    if(resp.status !== 201){
                        throw Error(`Recieve ${resp.status} from /search`)
                    }
                    if(resp.body.results.totalDataCount !== 1){
                        if(resp.body.results.totalDataCount > 1){
                            //multiply
                            return {done:true, value: {error: VerificationError.MultipleLicensesFoundError}}

                        }else{
                            //resp.results.totalDataCount < 1
                            return {done:true, value: {error: VerificationError.NoLicenseFoundError}}
                        }
                    }else{
                        let data = resp.body.results.data[0]
                        let nameCheck = prettyString(`${userRecord.firstName} ${userRecord.lastName}`) 
                            === prettyString( data.fullName )
                        if(!nameCheck){
                            return {done:true, value: {error: VerificationError.NameDoesNotMatchLicenseError}}
                        }
                        let licenseNumCheck = prettyString(userRecord.licenseNumber)
                            === prettyString(data.licenseNumber)
                        if(!licenseNumCheck){
                            return {done:true, value: {error: VerificationError.NumberDoesNotMatchLicenseError}}
                        }else{
                            return {done: false}
                        }
                    }
                }).then((searchResult) => {
                    if(!searchResult.done){
                        return cy.request({
                            method: "GET",
                            url: `search/physician-profiles/${prettyString(userRecord.licenseNumber)}`
                        }).then((resp) => {
                            return {done: false, value: resp}
                        })
                    }else{
                        return searchResult
                    }
                }).then((resp) => {
                    if(!resp.done){
                        let data = resp.value.body
                        let finalResponse = {}
                        finalResponse.name = data.middleInitial ? 
                            `${data.firstName} ${data.middleInitial} ${data.lastName}` 
                            : `${data.firstName} ${data.lastName}` 
                        finalResponse.licenseNumber = userRecord.licenseNumber
                        finalResponse.licenseStatus = data.status
                        let date = new Date(Date.parse(data.expirationDate))
                        finalResponse.expirationDate = 
                            `${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}/${date.getFullYear()}`
                        return {
                            done: true,
                            value: finalResponse
                        }
                    }else{  
                        return resp
                    }
                }).then((final) => {
                    cy.writeToOutput(final.value)
                })
            }
        })
    })
})