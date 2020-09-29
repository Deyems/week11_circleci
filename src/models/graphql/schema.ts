import {buildSchema} from 'graphql';

const schema = buildSchema(`
type OrganizationSchema{
    _id: ID!
    organization_name: String!
    createdAt:  String
    updatedAt: String
    marketValue: Int!
    address: String!
    ceo: String!
    country: String!
    products: [String!]
    employees: [String!]
}
type User{
    _id: ID!
    email: String!
    passkey: String!
    username: String!
}
input UserInput{
    username: String
    email: String!
    passkey: String!
}
input OrganizationInput{
    organization_name: String!
    marketValue: Int!
    address: String!
    ceo: String!
    country: String!
    products: [String!]
    employees: [String!]
} 
type Query{
    oneOrganization(id: ID!): OrganizationSchema
    allOrganizations: [OrganizationSchema]
    loginUser(userDetails: UserInput): User
}
type Mutation{
    createOrganization(organizations: OrganizationInput): OrganizationSchema
    createUser(userDetails: UserInput): User
    updateOrganization(id: ID!, organizations: OrganizationInput): OrganizationSchema
    deleteById(id: ID!): OrganizationSchema
    updateProduct(id: ID!, oldProduct: String!, newProduct: String!): OrganizationSchema
    updateEmployee(id: ID!, oldEmployee: String!, newEmployee: String!): OrganizationSchema
}
schema {
    query: Query
    mutation: Mutation
}
`);
export default schema;