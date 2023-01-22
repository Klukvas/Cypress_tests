# Small comment to this task
## UI only && API only
So, in the project, U will see the difference between UI and API scrappers
The service from your task contains the JSON responses and it is easy to collect the data
But sometimes we ran into the services returning the HTML and there are only 2 choices:
1. Parse HTML from the response
2. Parse service itself


## The logic of CurretTestState interface
```
type CurretTestState = {
    done: boolean
    value?:SuccessParsed | verificationErrorValue
    msg?: string
    makeScreenshot: boolean
}
```
In this task, I ran into a choice:
1. Throw an error if we get a value from the VerificationError enum (mark the test as failed)
> In this case, we "do not expect" any "exception"(Here I mean that data from input should find the license )
> We could handle these errors using Cypress.on(fail)
> In fact, the difference between the first and second is only what the result will be as a result of the test run
> (I mean how many tests will pass and how many will fail)
2. Skip all checks if we got a value from the VerificationError enum (mark the test as passed)
> But as far as I understand, we are quite expecting one of these errors.
> \+ since this is a "parser" and not a "test" if we have collected the data we need (or lack thereof) -> for us this is a positive case
> That is, for us, receiving a "lack of license" is a __approving__ result.
> In this case, we raise an error only in an unexpected case ->
> (example: in UI tests we raise an error only if we didn't find "container with license" and "container without a license")
> Also, similar logic will be able to handle one of the errors ->
> (example: After we got the value with "error" at the end, we can switch to another service to search for licenses)
> naive example, but I think the essence is clear

> p.s we could also make a state class. But in this case, I think that the CurretTestState object is enough