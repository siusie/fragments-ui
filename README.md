# fragments-ui

A web app that's run locally, used for testing purposes. Communicates with AWS to allow us to authenticate/log in. Amazon Cognito verifies whether the username and password match--if they do, it sends the appropriate tokens (via a POST response, in JSON format).

The tokens allow us to access our own resources (i.e., the `fragments` microservice). There are 3 tokens which are sent back from the server:

1. identity token: always a JWT. (_Who I am_)
2. access token: can be JWT (which has data embedded in it) or a random string of characters. (_Because I have this, I'm allowed to do what I'm asking to do_)
3. refresh token: within a certain time frame, can be exchanged for a new set of tokens without having to go through the authentication process again

The `fragments` microservice consists of:

- Amazon Cognito User Pool
- simple client Web App that authenticates and gets tokens
- microservice that can secure HTTP access via JWT tokens

## About

_fragments-ui_ was build with [Parcel](https://parceljs.org/), which bundles the JavaScript code, manages environment variables, and provides hot-reloading.
The [aws-amplify JavaScript SDK](https://www.npmjs.com/package/aws-amplify) connects the web app to Cognito User Pool and Hosted UI.

## Getting started with Docker

[What is Docker?](https://aws.amazon.com/docker/)

[Reference](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

A Docker image consists of read-only layers each of which represents a Dockerfile instruction. The layers are stacked and each one is a delta of the changes from the previous layer. When you run an image and generate a container, you add a new writable layer, also called the container layer, on top of the underlying layers. All changes made to the running container, such as writing new files, modifying existing files, and deleting files, are written to this writable container layer.

Dockerfile --> Image --> Container

## Deploying containers to AWS

When an application is containerized, it requires a container orchestration platform to automate the scheduling (i.e., deployment, running, updates) of your containers on servers, manage the network, restart or scale instances, handle versions and deployments, etc. Container orchestration platforms include Kubernetes and Amazon ECS.

Docker images are automatically deployed to Amazon ECS using git, GitHub and GitHub Actions. Amazon ECS is a fully managed container orchestration service, allowing us to

- deploy our images to run as containers
- provision cloud compute, network, storage, and other resources
- manage these containers (e.g., restarting crashed containers)
- scale the number of containers running at any given moment based on load
- monitor our containers
- manage updates (deployments)

Both ECS and EKS are often referred to as a "control plane," since they sit on top of, and manage, server instances for us: in order to run container workloads, we need to provision and manage cloud instances. ECS can use EC2 instances directly (i.e., self-managed) or via the serverless Fargate platform (i.e., fully managed). With Fargate we don't have to work directly with the VM or OS. We use Fargate in conjunction with container orchestration platforms (ECS or EKS) to manage the server resources necessary to run our containers. With Fargate, we don't need to provision, manage, secure, scale, or interact directly with our compute tier--no more manual EC2 setup!
