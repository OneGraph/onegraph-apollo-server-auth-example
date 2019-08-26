## OneGraph AuthGuardian Example for Apollo Server

This is an example of how to use OneGraph's powerful AuthGuardian to add
sophisticated, secure authentication and permissions to your Apollo server with
just a few lines of code

For more on AuthGuardian and all of the systems you can use it with (including
Apollo server, Netlify, Hasura, and more), check out the [intro video]() and the
[documentation]().

## Install

Simply use npm (or yarn):

```
npm install
# or
yarn
```

## Add in OneGraph configuration

First, sign up for OneGraph if you haven't already. This will give you GraphQL
access to your favorite APIs, and also allow you to configure authentication and
permissions for your Apollo server seamlessly.

Find your APP_ID from the OneGraph dashboard, and replace it in `index.js`.

That's it, you should be able to start the server!

```
node src/index.js
```

Now you can make GraphQL requests against `http://localhost:3010/graphql` with
GraphiQL app.

## Using a shared secret

By default `onegraph-apollo-server-auth` just needs your `APP_ID`, and it can
handle everything to make sure you have secure auth for your API. It does this
by using JWKs based off your `APP_ID` to find the public keys allowed for your
API.

If you'd like to use share-secret (HMAC) signatures as well, you can configure
your app on OneGraph to sign all JWTs with a password, and then update
`index.js` to set `sharedSecret` to the same value. Old tokens signed with the
RSA keys will continue to work unless you rotate the keys on OneGraph, so this
gives you a way to smoothly migrate back and forth as necessary.
