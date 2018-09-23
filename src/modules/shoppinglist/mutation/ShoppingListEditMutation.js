// @flow
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { generateToken } from '../../../auth';

import ShoppingListModel from '../ShoppingListModel';

export default mutationWithClientMutationId({
  name: 'ShoppingListLoginWithEmail',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ email, password }) => {
    const shoppingList = await ShoppingListModel.findOne({ email: email.toLowerCase() });

    const defaultErrorMessage = 'Invalid password';

    if (!shoppingList) {
      return {
        error: defaultErrorMessage,
      };
    }

    const correctPassword = shoppingList.authenticate(password);

    if (!correctPassword) {
      return {
        error: defaultErrorMessage,
      };
    }

    return {
      token: generateToken(shoppingList),
    };
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
