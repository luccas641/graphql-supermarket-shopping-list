// @flow

import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { connectionArgs, fromGlobalId } from 'graphql-relay';

import UserType, { UserConnection } from '../modules/user/UserType';
import ProductType, { ProductConnection } from '../modules/product/ProductType';
import ShoppingListType, { ShoppingListConnection } from '../modules/shoppinglist/ShoppingListType';
import { nodeField } from '../interface/NodeInterface';
import { UserLoader, ProductLoader, ShoppingListLoader } from '../loader';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    me: {
      type: UserType,
      resolve: (root, args, context) => (context.user ? UserLoader.load(context, context.user._id) : null),
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
        const { id } = fromGlobalId(args.id);
        return UserLoader.load(context, id);
      },
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj, args, context) => UserLoader.loadUsers(context, args),
    },
    product: {
      type: ProductType,
      args: {
        id: {
          type: GraphQLInt,
        },
        ean: {
          type: GraphQLString,
        }
      },
      resolve: (obj, args, context) => {
        return ProductLoader.load(context, args);
      },
    },
    products: {
      type: ProductConnection.connectionType,
      args: {
        ...connectionArgs,
        word: {
          type: GraphQLString,
        }
      },
      resolve: (obj, args, context) => ProductLoader.loadProducts(context, args),
    },
    shoppingList: {
      type: ShoppingListType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        }
      },
      resolve: (obj, args, context) => {
        return ShoppingListLoader.load(context, args.id);
      },
    },
    shoppingLists: {
      type: ShoppingListConnection.connectionType,
      args: {
        ...connectionArgs,
      },
      resolve: (obj, args, context) => ShoppingListLoader.loadShoppingLists(context, args),
    },
  }),
});
