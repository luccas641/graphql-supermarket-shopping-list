import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';

import { ShoppingListConnection } from '../ShoppingListType';
import pubSub, { EVENTS } from '../../../pubSub';

const ShoppingListAddedPayloadType = new GraphQLObjectType({
  name: 'ShoppingListAddedPayload',
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

const shoppingListAddedSubscription = {
  type: ShoppingListAddedPayloadType,
  subscribe: () => pubSub.asyncIterator(EVENTS.USER.ADDED),
};

export default shoppingListAddedSubscription;
