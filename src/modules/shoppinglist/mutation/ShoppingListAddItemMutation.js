// @flow
import { GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { generateToken } from '../../../auth';
import pubSub, { EVENTS } from '../../../pubSub';

import ShoppingListModel from '../ShoppingListModel';
import ShoppingList from '../ShoppingListLoader'
import ShoppingListType from '../ShoppingListType'

export default mutationWithClientMutationId({
  name: 'ShoppingListAddItem',
  inputFields: {
    _id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    productId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLInt),
    }
  },
  mutateAndGetPayload: async ({ _id, productId, quantity }, context) => {
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
    if(shoppingList.items == undefined) {
      shoppingList.items = []
    }
    if(quantity > 0) {
      let item = shoppingList.items.find((item) => item.productId == productId)
      if(item) {
        item.quantity += quantity
      } else {
        shoppingList.items.push({
          productId,
          quantity
        })
      }
    } else {
      shoppingList.items = shoppingList.items.filter((item) => item.productId != productId)
    }
    await shoppingList.save()
    await pubSub.publish(EVENTS.SHOPPING_LIST.CHANGED, { ShoppingListChanged: { shoppingList } });
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
      resolve: ({shoppingList}, args, context) => new ShoppingList(shoppingList, context)
    }
  },
});
