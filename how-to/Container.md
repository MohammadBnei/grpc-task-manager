# Container

The usage of containerisation is extremely important in a microservices environnement. The capacity to export an api with no dependencies while also being runnable almost anywhere is a formidable tool to facilitate the deployment of our application.

Let's talk about some tips when writing the script to build our api's container.

## Dockerfile

You'll see in each api folder a Dockerfile. This file contains the steps to take to produce a working, stable and self-contained api.

We need to choose a base image that is the most complete in terms of binary and packages needed to run our app while being at the same time the smallest size possible.

As any change in our codebase will result in rebuilding our image, we tend to use caching as much as possible. So, in our CI, there must be a way that saves each buiding step so that it can reuse them later.

The way docker handle this is by iteration order. That means that any changes in the previous steps will trigger a full rebuild for the latter steps.

In our nestjs [task-api Dockerfile](../task-api/Dockerfile), you can see that we copy the package.json (and lock file) before copying the entire codebase. The result of that order is that when we make a code change, it will only redo the nest build command, not the package installation. If we copied everything in one starting line, each code change would result in a full image rebuild, not efficient at all.

Multi stage build is also a good practice, specifically when the choosen language produces binary executables. 