// @flow

import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import type { GraphQLContext } from '../../../TypeDefinition';

import ShoppingListType from '../ShoppingListType';
import * as ShoppingListLoader from '../ShoppingListLoader';

export default mutationWithClientMutationId({
  name: 'ShoppingListChangePassword',
  inputFields: {
    oldPassword: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'shoppingList new password',
    },
  },
  mutateAndGetPayload: async ({ oldPassword, password }, { shoppingList }: GraphQLContext) => {
    if (!shoppingList) {
      return {
        error: 'ShoppingList not authenticated',
      };
    }

    const correctPassword = shoppingList.authenticate(oldPassword);

    if (!correctPassword) {
      return {
        error: 'INVALID_PASSWORD',
      };
    }

    shoppingList.password = password;
    await shoppingList.save();

    return {
      error: null,
    };
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
    me: {
      type: ShoppingListType,
      resolve: (obj, args, context) => ShoppingListLoader.load(context, context.shoppingList.id),
    },
  },
});
