# fragments-ui

Web app that's run locally, used for testing purposes. Communicates with AWS to allow us to authenticate/log in. Amazon Cognito verifies whether the username and password match--if they do, it sends us the appropriate tokens.

The tokens allow us to access our own resources (i.e., the `fragments` microservice).
