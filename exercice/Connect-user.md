# Exercice - NestJS - Connect to User-Api

## 1. Protobuf Definition

1. Modify the protobuf definition of the hero.proto to add a `user_id` (type **string**) to the hero.
2. Add a `user_id` to the create Hero function.

The hero is now assigned to a user. 
Regenerate the stubs with `export.sh`

## 2. Hero Api

1. Add inside grpc.config the grpc configuration that connects to the user. Look at the [auth-api grpc config](../auth-api/src/config/grpc.option.ts) for an exemple.
2. Remove the guard from the user api find function ([here](../user-api/src/user/user.controller.ts))
3. Inject the grpc user service inside your hero controller ([help](https://docs.nestjs.com/microservices/grpc#client)).
4. Add a request to the user api, using find, to verify that the user exists before creating the hero.

