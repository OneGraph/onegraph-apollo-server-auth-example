const schema = `
// These two custom directives are implemented by the
// onegraph-apollo-server-auth package
directive @isAuthenticated on QUERY | FIELD_DEFINITION
directive @hasRole(oneOf: [String!]) on QUERY | FIELD_DEFINITION

type Query {
  companies: [Company] @isAuthenticated
}

type Company {
  id: String!
  name: String @hasRole(oneOf: ["user"])
  createdAt: String
  accountBalance: Int! @hasRole(oneOf: ["admin"])
}
`;

module.exports = {schema};
