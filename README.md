# Web scraper interview

## Problem

We want to use the [Massachusetts Board of Registration in Medicine](https://findmydoctor.mass.gov/) to verify a license
we receive as input. 

Write a web scraper that takes input at [cypress/fixtures/input.json](cypress/fixtures/input.json) in the form of:

```json
{
  "firstName": <string>,
  "lastName": <string>,
  "licenseNumber": <string>
}
```

and, if successful,
1) writes a file to `cypress/output/data.json` in the format:
```json
{
  "name": <string>,
  "licenseNumber": <string>,
  "licenseStatus": <string>,
  "expirationDate": MM/DD/YYYY
}
```
2) writes a screenshot of the full license detail page to `cypress/output/screenshot.png`.

If a scraper encounters an error as enumerated in `VerificationError` in `cypress/e2e/massachusetts_state_license.cy.ts`,
output the following to `cypress/output/data.json`:
```json
{
  "error": <string>
}
```

## Requirements

A successful license must:
- Have a license number that matches the input license number
- Have a name that contains both the first and last name in input

A screenshot must contain all information present on the license detail page, even if it is not scraped.

## Test data

You can find two valid licenses at `cypress/test_data/licenses.json` that you can copy to use as input.

The correct output for the active license can be found at `cypress/example_output`.
