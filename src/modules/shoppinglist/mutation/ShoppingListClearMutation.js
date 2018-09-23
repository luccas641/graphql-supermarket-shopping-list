// @flow
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { generateToken } from '../../../auth';
import pubSub, { EVENTS } from '../../../pubSub';

import ShoppingListModel from '../ShoppingListModel';

export default mutationWithClientMutationId({
  name: 'ShoppingListRegisterWithEmail',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ name, email, password }) => {
    let shoppingList = await ShoppingListModel.findOne({ email: email.toLowerCase() });

    if (shoppingList) {
      return {
        error: 'Email already in use',
      };
    }

    shoppingList = new ShoppingListModel({
      name,
      email,
      password,
    });

    await shoppingList.save();

    await pubSub.publish(EVENTS.USER.ADDED, { ShoppingListAdded: { shoppingList } });

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
