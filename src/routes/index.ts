import {graphqlHTTP} from 'express-graphql';
import graphqlschema from '../models/graphql/schema';
import { root } from '../controller/resolvers';

/* GET home page. */

export default graphqlHTTP({
  schema: graphqlschema,
  rootValue: root,
  graphiql: true,
});
    