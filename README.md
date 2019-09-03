# firebase-functions-graphql-firestore
This project aims to provide a boilerplate to host a GraphQL API on Firebase functions, using Firestore for the database

You can clone it and go through the setup and configuration described below

After following this process, you'll have a GraphQL API supporting :
- Firebase email/password authentication (signUp, signIn)
- Google account authentication (with token)
- Admin role (with custom token claims)

You can then add your custom resolvers and schemas in the `functions/graphql` folder


# Setup to run locally
From root folder, install dependencies
```
npm install
```

From `functions` folder, install dependencies
```
cd functions
npm install
```

# Create and configure Firebase app
1. Go to Firebase console, create your project
2. Go to your Firebase database tab and create a Firestore DB in test mode (the project includes rules in `firestore.rules`)
3. Go to your Firebase authentication methods and activate `Email/password` and `Google`
4. Get your authentication domain name (available lower on the same page) and copy it into `functions/config.js` in `authDomain` key
5. Go to your Firebase project parameters page and copy your project id and API key into `functions/config.js` in `projectId` and `apiKey` keys respectively
6. In project parameters, go in "Service accounts" tab, then in "Manage service account authorizations"
7. In "IAM" tab (left menu), find a service account that has role "Service Account Token Creator" (you can also create a new one but you have to give it the role for authentication to work correctly)
8. Go back to "Service Accounts" tab (left menu) and edit the chosen account to create its `json` key file, download it and place it in the `secrets` folder
9. In the `.env` file, edit `GOOGLE_APPLICATION_CREDENTIALS` to match `./secrets/YOUR_JSON_KEY_FILENAME.json`

# Run locally
```
npm run dev
```
Then visit `http://localhost:8000/`

# Test authentication
You can now test that the API is working normally via the GraphQL playground
Let's create an email/password user
```
mutation {
  signUp(email: "test@gmail.com", password: "test123", pwdConfirmation: "test123", displayName: "Test email/pwd"){token}
}
````
If everything is set up correctly, you'll get the token back in the response

You can now try to login
```
mutation{
  signIn(email: "test@gmail.com", password: "test123"){token}
}
```

And if you send a request with the http header `x-token` set to the token you received back
```
{
  "x-token": "TOKEN_OBTAINED_FROM_SIGNIN_OR_SIGNUP"
}
```

Any request you make with these headers will be authenticated as the user, for example the special query `me` can return the current user's infos
```
query {
  me {
    uid,
    displayName
  }
}
```

You can also set the admin user claim with the `setAdmin` mutation using the user's `uid` and `isAdmin` params
```
mutation {
  setAdmin(userId: "USER_UID", isAdmin: true)
}
```
If you try this with the user you just signed up, this will result in a `not-authorized` error

To set your user admin, you need to modify the `permissions/{UID}/isAdmin` field to `true` from the Firebase console

This will add an `isAdmin` custom claim to your Firebase user that you can check in your resolvers, check the `setAdmin` mutation in `functions/graphql/resolvers/users.js`

# Setup the firebase CLI and deploy
If you don't have the CLI installed, run :
```
npm install -g firebase-tools
```
Then set the CLI project, (if you just installed you need to `firebase login` first)
```
firebase list # find your project id with list command
firebase use your-project-id
```
And deploy !
```
firebase deploy
```
**CAVEAT** : When navigating to your deployed GraphQL playground, it will seem not to be working, this is because the URL in the playground is wrong, you need to add `/graphql` at the end of the url in the playground's address bar

# Adding your custom resolvers and schemas
Create a new schema in `functions/graphql/schema/yourSchema.js` with the help of this template :
```
const { gql } = require('apollo-server-express')

const yourSchema = gql`
  extend type Query {
 
  }

  extend type Mutation {
   
  }
`

module.exports = yourSchema
```
Once your schema is ready, add it in `functions/graphql/schema/index.js`, like so :
```
const yourSchema = require('./yourSchema')
module.exports = [linkSchema, userSchema, yourSchema]
```

Then create the corresponding resolvers in `functions/graphql/resolvers/yourResolvers.js`
```
const yourResolvers = {
    Query: {

    },

    Mutation: {

    }
}

module.exports = yourResolvers
```
Then add it in `functions/graphql/resolvers/index.js`, like so :
```
const yourResolvers = require('./yourResolvers')
module.exports = [userResolvers, yourResolvers]
```


# Disclaimer
This project is in its early stage and I might not have a lot of time to maintain it, so use at your own risks
You're welcome to open an issue for suggestions or problems



