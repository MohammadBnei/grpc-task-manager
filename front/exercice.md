# Exercices

## User Update

Create a user update page for changing the first name and last name

1. Create the routes/user/+page.server.ts
2. Create an action to update the user
   1. You will have to
      1. extract the data from the fromData
      2. Make sure the data is correct
      3. send the updated user to the user-api with gRPC
      4. Handle errors
3. Create the svelte page in lib/component/user
   1. Create a form
   2. Create the fields with the names
   3. Handle errors
