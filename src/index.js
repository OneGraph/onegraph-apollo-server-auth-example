const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const {typeDefs} = require('./typeDefs.js');
const {
  hasRole,
  isAuthenticated,
  makeOneGraphJwtVerifier,
} = require('@sgrove/onegraph-apollo-server-auth');

// OneGraph configuration
// 1. Find your APP_ID by logging into the OneGraph dashboard
const verifyJwtFromHeaders = makeOneGraphJwtVerifier(ONEGRAPH_APP_ID, {
  // Advanced usage: Uncomment this line if you want to allow shared-secret JWTs.
  // This is optional, as by default OneGraph will use public/private signatures.
  // sharedSecret: "passwordpasswordpasswordpasswordpasswordpasswordpasswordpasswordpassword"
});

// Some dummy-data backing our GraphQL API
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
  typeDefs: typeDefs,
  resolvers,
  schemaDirectives: {
    hasRole,
    isAuthenticated,
  },
  // The custom context function will decode, verify, and insert the JWT payload
  // for both resolvers and the auth directives
  context: async incoming => {
    let jwtContext;

    // Extract and verify the JWT using OneGraph's helper function
    try {
      jwtContext = await verifyJwtFromHeaders(incoming.req.headers);
    } catch (e) {}

    // Now add any custom properties you'd like to have in addition to the JWT
    // context
    const context = {...jwtContext, reqStart: Date.now()};
    return context;
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
