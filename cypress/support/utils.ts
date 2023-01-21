const Validator = require('jsonschema').Validator;
const fs = require('fs');


interface userDataInput {
    firstName: string
    lastName: string
    licenseNumber: string
}

function validateUserDataInput (dataObj:userDataInput): Array<any> {
    const validator = new Validator();
    const userDataSchema: Object = {
        "id": "/UserDataSchema",
        "type": "object",
        "properties": {
            "firstName": {"type": "string", "minLength": 1}, //jsut check that we have not empty value
            "lastName": {"type": "string", "minLength": 1},
            "licenseNumber": {"type": "string", "pattern": /\d{5}/} //based on example I guess licensie could contains ONLY 5 numbers 
        }
    }
    let result = validator.validate(dataObj, userDataSchema, {required: true})
    return result.errors
}

// function writeToOutput(dataToWrite:object): void{
//     console.log(Cypress.env('pathToOutput'))
//     let existedData:object[] = JSON.parse( fs.readFileSync(Cypress.env('pathToOutput'), 'utf8') )
//     existedData.push(dataToWrite)
//     return fs.writeFileSync(Cypress.env('pathToOutput'), JSON.stringify(existedData))
// }


function prettyString(data:string): string{
    return data.trim().toLowerCase()
}

const enum VerificationError {
    NoLicenseFoundError = 'NoLicenseFoundError',
    NameDoesNotMatchLicenseError = 'NameDoesNotMatchLicenseError',
    NumberDoesNotMatchLicenseError = 'NumberDoesNotMatchLicenseError',
    MultipleLicensesFoundError = 'MultipleLicensesFoundError',
    IncorrectInputData = 'IncorrectInputData'
  }

const monthNum = {
    "january" : 1,
    "february" : 2, 
    "march" : 3, 
    "april" : 4, 
    "may" : 5, 
    "june" : 6, 
    "july" : 7, 
    "august" : 8, 
    "september" : 9, 
    "october" : 10, 
    "november" : 11,
    "december" : 12,
}

export {prettyString, validateUserDataInput, monthNum, VerificationError}