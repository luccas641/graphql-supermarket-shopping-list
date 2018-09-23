// @flow
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { generateToken } from '../../../auth';
import pubSub, { EVENTS } from '../../../pubSub';

import ShoppingListModel from '../ShoppingListModel';

export default mutationWithClientMutationId({
  name: 'ShoppingListRemove',
  inputFields: {
    _id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ _id }, context) => {
    if (!context.user) {
      return {
        error: 'User not authenticated',
      };
    }
    let shoppingList = await ShoppingListModel.findById(_id);
    if(!shoppingList) {
      return {
        error: 'Resource not found'
      }
    }
    if(shoppingList.user != context.user.id) {
      return {
        error: 'User not authorized',
      };
    }
    await shoppingList.remove();
    await pubSub.publish(EVENTS.SHOPPING_LIST.REMOVED, { ShoppingListRemoved: { shoppingList } });

    return {
      error: null
    };
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
