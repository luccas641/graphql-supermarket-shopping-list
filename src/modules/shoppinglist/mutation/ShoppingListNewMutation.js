// @flow

import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import pubSub, { EVENTS } from '../../../pubSub';

import type { GraphQLContext } from '../../../TypeDefinition';

import ShoppingListType from '../ShoppingListType';
import ShoppingList from '../ShoppingListModel'
import * as ShoppingListLoader from '../ShoppingListLoader';

export default mutationWithClientMutationId({
  name: 'ShoppingListNew',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    }
  },
  mutateAndGetPayload: async ({ name }, context: GraphQLContext) => {
    if (!context.user) {
      return {
        error: 'User not authenticated',
      };
    }
    let shoppingList = new ShoppingList();
    shoppingList.name = name;
    shoppingList.user = context.user;
    await shoppingList.save();
    await pubSub.publish(EVENTS.SHOPPING_LIST.CREATED, { ShoppingListCreated: { shoppingList } });

    return {
      error: null,
      shoppingList
    };
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
    shoppingList: {
      type: ShoppingListType,
      resolve: (obj, args, context) => obj.error ? null : ShoppingListLoader.load(context, obj.shoppingList.id),
    },
  },
});
