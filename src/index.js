const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const {makeExecutableSchema} = require('graphql-tools');
const {schema} = require('./schema.js');
const {
  extractBearerToken,
  hasRoleDirective,
  isAuthenticatedDirective,
  makeOneGraphJwtVerifier,
} = require('@sgrove/onegraph-apollo-server-auth');

// OneGraph configuration
// 1. Find your APP_ID by logging into the OneGraph dashboard
const APP_ID = '<your-app-id>';
// 2. The sharedSecret is optional! By default OneGraph will use public/private signatures.
// const sharedSecret = "passwordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpassword";

const verifyJwt = makeOneGraphJwtVerifier(APP_ID, {
  // Uncomment this line if you want to allow shared-secret JWTs
  // sharedSecret: sharedSecret
});

// Some dummy-data backing our API
const companies = [
  {
    id: '1',
    name: 'OneGraph',
    createdAt: 'Fri May 04 2018 12:00:00 GMT-0700 (PDT)',
    accountBalance: 9999,
  },
  {
    id: '2',
    name: 'Hasura',
    createdAt: 'Wed Jan 01 2014 11:00:00 GMT-0800 (PST)',
    accountBalance: 9999,
  },
  {
    id: '3',
    name: 'AppSync',
    createdAt: 'Fri May 06 2016 12:00:00 GMT-0700 (PDT)',
    accountBalance: 9999,
  },
];

// ApolloServer setup:
// 1. The resolvers
const resolvers = {
  Query: {companies: () => companies},
};

// 2. The server (including populating the resolver context via JWT)
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  schemaDirectives: {
    hasRole: hasRoleDirective,
    isAuthenticated: isAuthenticatedDirective,
  },
  context: async incoming => {
    // Anything else you'd like in the resolver context goes here.
    let context = {};

    // Extract the JWT using OneGraph's helper function
    const token = extractBearerToken(incoming.req);

    if (!token) {
      return {...context, jwt: null};
    }

    // If we have a token, try to decode and verify it using either
    // public/private or shared-secret, depending on the preference
    // stored in the JWT. If we fail, discard the token and return
    // a mostly-empty context
    try {
      const decoded = await verifyJwt(token).catch(rejection =>
        console.warn(`JWT verification failed: `, rejection),
      );
      return {...context, jwt: decoded};
    } catch (rejection) {
      console.warn(rejection);
      return {...context, jwt: null};
    }
  },
});

// 3. Initialize the express app
const app = express();
server.applyMiddleware({app});

// 4. Start the server, we're ready to go!
app.listen(3010, () => {
  console.log(
    `Server ready and listening for GraphQL queries at http://localhost:3010${server.graphqlPath}`,
  );
});
