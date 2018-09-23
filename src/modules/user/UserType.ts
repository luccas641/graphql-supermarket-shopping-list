import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';
import ShoppingListType, {ShoppingListConnection} from '../shoppinglist/ShoppingListType';

import { UserLoader, ProductLoader, ShoppingListLoader } from '../../loader';
import { GraphQLContext } from '../../TypeDefinition';

const UserType = registerType(
  new GraphQLObjectType({
    name: 'User',
    description: 'User data',
    fields: () => ({
      id: globalIdField('User'),
      _id: {
        type: GraphQLString,
        resolve: user => user._id,
      },
      name: {
        type: GraphQLString,
        resolve: user => user.name,
      },
      email: {
        type: GraphQLString,
        resolve: user => user.email,
      },
      active: {
        type: GraphQLBoolean,
        resolve: user => user.active,
      },
      shoppingLists: {
        type: ShoppingListConnection.connectionType,
        resolve: async (user, args, context: GraphQLContext) => {
          return ShoppingListLoader.loadUserShoppingList(context, {userId: user._id})
        }
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default UserType;

export const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: GraphQLNonNull(UserType),
});
