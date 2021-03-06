import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';

import { ShoppingListConnection } from '../ShoppingListType';
import pubSub, { EVENTS } from '../../../pubSub';

const ShoppingListCreatedPayloadType = new GraphQLObjectType({
  name: 'ShoppingListCreatedPayload',
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

const shoppingListCreatedSubscription = {
  type: ShoppingListCreatedPayloadType,
  subscribe: () => pubSub.asyncIterator(EVENTS.SHOPPINGLIST.CREATED),
};

export default shoppingListCreatedSubscription;
