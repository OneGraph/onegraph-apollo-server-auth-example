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
![Where to find your APP_ID on OneGraph](imgs/app_id_preview.png?raw=true)

> Note that you cannot just use anyone else's OneGraph APP_ID, as your app will
> be signed with different keys, and therefore your rules will not apply.

That's it, you should be able to start the server!

```
node src/index.js
```

Now you can make GraphQL requests against `http://localhost:3010/graphql` with
GraphiQL app.

## Configure your auth rules in AuthGuardian
A good starter set of rules might be:

```
Rule 1:
When this user on GitHub has a login status of true

Then set the JSON value at path user.id to a known value of GITHUB_USER_ID
```
![Preview of AuthGuardian rule #1](imgs/rule_1.png?raw=true)


```
Rule 2:
When this user on GitHub belongs to an organization named MY_ORG

Then add to the JSON list at path user.roles a static JSON value of "admin"
```
![Preview of AuthGuardian rule #2](imgs/rule_2.png?raw=true)

That should be enough that your users can simply log in with GitHub to
authenticate, but any fields in your schema requiring a "admin" role will only
be visible to GitHub users who are logged in and belong to `MY_ORG` on GitHub.

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
