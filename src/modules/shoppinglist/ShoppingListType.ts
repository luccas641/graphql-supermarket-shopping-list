import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

import UserType from '../user/UserType'
import ShoppingItemType from '../shoppingitem/ShoppingItemType'

const ShoppingListType = registerType(
  new GraphQLObjectType({
    name: 'ShoppingList',
    description: 'ShoppingList data',
    fields: () => ({
      id: globalIdField('ShoppingList'),
      _id: {
        type: GraphQLString,
        resolve: shoppingList => shoppingList._id,
      },
      name: {
        type: GraphQLString,
        resolve: (shoppingList) => shoppingList.name,
      },
      user: {
        type: UserType,
        resolve: (shoppingList, args, context) => {
          return context.dataloaders.UserLoader.load(shoppingList.user)
        }
      },
      items: {
        type: new GraphQLList(ShoppingItemType),
        resolve: shoppingList => shoppingList.items,
      },
      status: {
        type: GraphQLString,
        resolve: shoppingList => shoppingList.status,
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default ShoppingListType;

export const ShoppingListConnection = connectionDefinitions({
  name: 'ShoppingList',
  nodeType: GraphQLNonNull(ShoppingListType),
});
