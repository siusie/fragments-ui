# fragments-ui

Web app that's run locally, used for testing purposes. Communicates with AWS to allow us to authenticate/log in. Amazon Cognito verifies whether the username and password match--if they do, it sends the appropriate tokens (via a POST response, in JSON format).

The tokens allow us to access our own resources (i.e., the `fragments` microservice). There are 3 tokens which are sent back from the server:

1. identity token: always a JWT. (_Who I am_)
2. access token: can be JWT (which has data embedded in it) or a random string of characters. (_Because I have this, I'm allowed to do what I'm asking to do_)
3. refresh token: within a certain time frame, can be exchanged for a new set of tokens without having to go through the authentication process again
