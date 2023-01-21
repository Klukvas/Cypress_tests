import {VerificationError} from  './common_utils'

interface ResponseValue{
    status?:Cypress.Chainable
    expiration?:Cypress.Chainable
    name?:Cypress.Chainable
}

interface UserDataInput {
    firstName: string
    lastName: string
    licenseNumber: string
}

interface SuccessParsed{
    name: string
    licenseNumber: string
    licenseStatus: string
    expirationDate: string
}

type verificationErrorValue = {
    error: keyof typeof VerificationError;
}

/**
 * This is the description of the interface
 *
 * @interface CurretTestState
 * @member {boolean} done is used for displaying the state of the current test
 * if it is false => the test will run its checks
 * if it is true => the test will skip its checks
 * @member {SuccessParsed | verificationErrorValue} value
 * value could not be filled only if done filed eql to false
 * it is used for output
 * @member {string} msg could be filled in we need to throw an error
 */
interface CurretTestState{
    done: boolean
    value?:SuccessParsed | verificationErrorValue
    msg?: string
}


export {ResponseValue, UserDataInput, SuccessParsed, CurretTestState}