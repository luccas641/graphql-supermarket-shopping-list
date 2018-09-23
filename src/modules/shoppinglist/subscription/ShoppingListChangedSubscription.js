import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';

import { ShoppingListConnection } from '../ShoppingListType';
import pubSub, { EVENTS } from '../../../pubSub';

const ShoppingListChangedPayloadType = new GraphQLObjectType({
  name: 'ShoppingListChangedPayload',
  fields: () => ({
    shoppingListEdge: {
      type: ShoppingListConnection.edgeType,
      resolve: ({ shoppingList }) => ({
        cursor: offsetToCursor(shoppingList.id),
        node: shoppingList,
      }),
    },
  }),
});

const shoppingListChangedSubscription = {
  type: ShoppingListChangedPayloadType,
  subscribe: () => pubSub.asyncIterator(EVENTS.SHOPPINGLIST.CHANGED),
};

export default shoppingListChangedSubscription;
