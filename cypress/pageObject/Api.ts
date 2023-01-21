


import {VerificationError, prettyString} from '../support/common_utils'
import {UserDataInput, CurretTestState, SuccessParsed} from '../support/interface'



export class SearchResponse{


    processUserLicense(resp: Cypress.Response<any>, userRecord: UserDataInput):CurretTestState{
        if(resp.body.results.totalDataCount !== 1){
            if(resp.body.results.totalDataCount > 1){
                return {done:true, value: {error: VerificationError.MultipleLicensesFoundError}}

            }else{
                return {done:true, value: {error: VerificationError.NoLicenseFoundError}}
            }
        }else{
            let data = resp.body.results.data[0]
            let nameCheck = prettyString(`${userRecord.firstName} ${userRecord.lastName}`) 
                === prettyString( data.fullName )
            if(!nameCheck){
                return {done:true, value: {error: VerificationError.NameDoesNotMatchLicenseError}}
            }
            let licenseNumCheck = prettyString(userRecord.licenseNumber) === prettyString(data.licenseNumber)
            if(!licenseNumCheck){
                return {done:true, value: {error: VerificationError.NumberDoesNotMatchLicenseError}}
            }else{
                return {done: false}
            }
        }
    }


    processLicenseData(resp: Cypress.Response<any>, userRecord: UserDataInput):CurretTestState{
        let data = resp.body;
        let finalResponse = {} as SuccessParsed;
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
    }
}


