// @flow

import { GraphQLObjectType } from 'graphql';

import UserMutations from '../modules/user/mutation';
import ShoppingListMutations from '../modules/shoppinglist/mutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...ShoppingListMutations,
  }),
});
