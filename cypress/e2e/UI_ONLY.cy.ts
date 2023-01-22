import {SearchForm, SearchGrid} from '../pageObject/UI/SearchPage'
import {LicenseInformation, ResponseValue} from '../pageObject/UI/ProfilePage'
import inputJson from '../fixtures/input.json'
import {prettyString, validateUserDataInput, MonthNum, VerificationError} from '../support/common_utils'
import {CurretTestState, SuccessParsed} from '../support/interface'


describe('Prove license data', {baseUrl: 'https://findmydoctor.mass.gov/'}, () => {
  let licenseInformation: LicenseInformation;
  let searchGrid: SearchGrid;
  let searchForm: SearchForm;
  before(() => {
    licenseInformation = new LicenseInformation();
    searchForm = new SearchForm();
    searchGrid = new SearchGrid();
  })

  beforeEach(() => {
    cy.visit('/');
  })

  inputJson.forEach((userRecord) => {
    it(`Get data about license of user: ${JSON.stringify( userRecord )}`, () => {
      cy.intercept('POST', 'https://api.medboard.mass.gov/api-public/search').as('searchReq')
      let res: Array<any> = validateUserDataInput(userRecord)
      if (res.length){
          cy.writeToOutput({error: VerificationError.IncorrectInputData})
      }else{
          searchForm.fillFirstName(userRecord['firstName'])
          searchForm.fillLastName(userRecord['lastName'])
          searchForm.clickSearchBtn()
          /* 
          We have a delay after the search button is clicked 
              and the container with results is displayed 
              due to which the Find command did not find the result container
          To avoid the use of cy.wait, we use interception -> 
          ------========-------
          small comment: I do not use a response object here cuz these tests 
          describe the web page that does not contain JSON responses from API
          ( I just wanna show how to deal in cases when we do not have JSON responses )
        */
          cy.wait('@searchReq', {timeout:6000})
          cy.wait(600) //just for rendering

          
          searchGrid.checkIfLicenseExists().then((resultOfSearch):CurretTestState => {
            if(resultOfSearch.result){
                  if(resultOfSearch.element.length !== 1){
                    return {done: true, value: {error: VerificationError.MultipleLicensesFoundError}, makeScreenshot: false}
                  }else{
                    return {done: false, makeScreenshot: true}
                  }
            }else{
                  if(resultOfSearch?.msg){
                    return {done: true, msg: resultOfSearch.msg, makeScreenshot: false}
                  }else{
                        return {done: true, value: {error: VerificationError.NoLicenseFoundError}, makeScreenshot: false}
                      }
              }
          }).then((resultOfRowCheck:CurretTestState) => {
            if(!resultOfRowCheck.done){
              return searchGrid.getLicenseNum().then((licensNum):CurretTestState => {
                  if(prettyString(licensNum) !== prettyString(userRecord.licenseNumber)){
                    return {done: true, value: {error: VerificationError.NumberDoesNotMatchLicenseError}, makeScreenshot: false}
                  }else{
                    return {done: false, makeScreenshot: true}
                  }
                })
            }
          }).then((checkLicenseNumRes:CurretTestState) => {
            if(!checkLicenseNumRes.done){
              return searchGrid.getFullName().then((fullName):CurretTestState => {
                    let result = prettyString(fullName) === prettyString(userRecord.firstName + ' ' + userRecord.lastName)
                    if(!result){
                      return {done: true, value: {error: VerificationError.NameDoesNotMatchLicenseError}, makeScreenshot: false}
                    }else{
                      return {done: false, makeScreenshot: true}
                    }
                  })
                }
           
          }).then((checkNameRes:CurretTestState) => {
            if(!checkNameRes.done){
              cy.visit(`/profiles/${prettyString( userRecord.licenseNumber )}`)
              return licenseInformation.getDataByKeys().then(function(licenseData:ResponseValue) {
                  return licenseInformation.parseData(licenseData)
              })
            }
          }).then((finalData:CurretTestState)=>{
            //we also could check by URL. But I added the "makescreenshot" key for API tests
            if(finalData.makeScreenshot){
              cy.screenshot(`${JSON.stringify(userRecord)}`, {overwrite: true})
            }
            cy.writeToOutput(finalData.value)
          })
      }
    })
  })
})