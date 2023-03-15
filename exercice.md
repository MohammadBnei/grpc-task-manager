## Set the user in store (work in pairs - api modification)

1. Front End :
   1. Create a user store, that will be used to save the user obtained from the login
   2. Modify the login action to get the user from the successfull login request
   3. Set the user in a cookie (bonus: hash it)
   4. On the front end (.svelte), store the user in the userstore
   5. In the header, change thee login button to disconnect when connected, and open the login page when disconnected
2. ProtoBuf :
   1. Modify the message definition for the auth service, including a user in the login response
   2. You will need to have buf installed locally, see [here](https://github.com/bufbuild/buf) and [here](https://docs.buf.build/installation)
3. Update the auth api to return the user alongside the jwt and the refresh token