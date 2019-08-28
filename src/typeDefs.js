const typeDefs = `
directive @isAuthenticated on QUERY | FIELD_DEFINITION
directive @hasRole(oneOf: [String!]) on QUERY | FIELD_DEFINITION

type Query {
  companies: [Company]
}

type Company {
  id: String!
  name: String @hasRole(oneOf: ["user"])
  createdAt: String @isAuthenticated
  accountBalance: Int! @hasRole(oneOf: ["admin"])
}
`;

module.exports = {typeDefs};
