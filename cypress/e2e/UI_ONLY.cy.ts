import {SearchForm, SearchGrid} from '../pageObject/SearchPage'
import {LicenseInformation, ResponseValue} from '../pageObject/UI/ProfilePage'
import inputJson from '../fixtures/input.json'
import {prettyString, validateUserDataInput, MonthNum, VerificationError} from '../support/common_utils'

interface resultOfCheck{
  done: boolean,
  msg?: string
  value?: object
}


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
          cy.wait(500) //just for rendering
          searchGrid.checkIfLicenseExists().then((resultOfSearch):resultOfCheck => {
            if(resultOfSearch.result){
                  if(resultOfSearch.element.length !== 1){
                    return {done: true, value: {error: VerificationError.MultipleLicensesFoundError}}
                  }else{
                    return {done: false}
                  }
            }else{
                  if(resultOfSearch?.msg){
                    return {done: true, msg: resultOfSearch.msg}
                  }else{
                        return {done: true, value: {error: VerificationError.NoLicenseFoundError}}
                      }
              }
          }).then(resultOfRowCheck => {
            if(!resultOfRowCheck.done){
              return searchGrid.getLicenseNum().then((licensNum) => {
                  if(prettyString(licensNum) !== prettyString(userRecord.licenseNumber)){
                    return {done: true, value: {error: VerificationError.NumberDoesNotMatchLicenseError}}
                  }else{
                    return {done: false}
                  }
                })
            }else{
              return resultOfRowCheck
            }
          }).then((checkLicenseNumRes:resultOfCheck) => {
            console.log(`checkLicenseNumRes: ${JSON.stringify(checkLicenseNumRes)}`)
            if(!checkLicenseNumRes.done){
              console.log('HERE')
              return searchGrid.getFullName().then((fullName):resultOfCheck => {
                    let result = prettyString(fullName) === prettyString(userRecord.firstName + ' ' + userRecord.lastName)
                    if(!result){
                      return {done: true, value: {error: VerificationError.NameDoesNotMatchLicenseError}}
                    }else{
                      return {done: false}
                    }
                  })
            }else{
              return checkLicenseNumRes
            }
          }).then((checkNameRes:resultOfCheck) => {
            if(!checkNameRes.done){
              cy.visit(`/profiles/${prettyString( userRecord.licenseNumber )}`)
              return licenseInformation.getDataByKeys().then(function(licenseData:ResponseValue):resultOfCheck {
                  // let resp: successResp
                  // resp.licenseNumber = userRecord.licenseNumber
                  let resp = {
                    value:{
                      licenseNumber: userRecord.licenseNumber,
                      expirationDate:null,
                      licenseStatus:null,
                      name: null
                    },
                    done: false
                    
                  }
                  licenseData.expiration.then($expirationDate => {
                    console.log(`resp: ${JSON.stringify(resp)}`)
                    let expnDate = $expirationDate.text();
                    let dateRegex = /(\w{3,9})\s(\d{2})\,\s(\d{4})/gsi
                    let dataGroup =  dateRegex.exec(expnDate)
                    expect(dataGroup.length).to.be.eq(4)
                    let [month, day, year] = Object.values( dataGroup ).slice(1,4)
                    expnDate = `${MonthNum[prettyString(month)]}/${day}/${year}`
                    resp.value.expirationDate = expnDate
                  });
        
                  licenseData.status.then($status => {
                    resp.value.licenseStatus = prettyString($status.text())
                  });

                  licenseData.name.then($fullName => {
                      resp.value.name = prettyString($fullName.text())
                  });
                  resp.done = true
                  return resp

                })
            }else{
              return checkNameRes
            }
          }).then((finalData:resultOfCheck)=>{
            cy.writeToOutput(finalData.value)
          })
      }
    })
  })
})