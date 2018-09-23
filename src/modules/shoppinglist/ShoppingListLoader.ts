import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import { Types } from 'mongoose';
import { ConnectionArguments } from 'graphql-relay';

import ShoppingListModel, { IShoppingList, ShoppingItem } from './ShoppingListModel';

import { GraphQLContext } from '../../TypeDefinition';

export default class ShoppingList {
  id: string;

  _id: Types.ObjectId;

  name: string;

  user: object;

  items: Array<ShoppingItem>;

  constructor(data: IShoppingList, { shoppingList }: GraphQLContext) {
    this.id = data.id;
    this._id = data._id.toString();
    this.name = data.name;
    this.user = data.user;
    this.items = data.items;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(ShoppingListModel, ids));

const viewerCanSee = () => true;

export const load = async (context: GraphQLContext, id): Promise<ShoppingList | null> => {
  if (!id) {
    return null;
  }
  let data;
  try {
    data = await context.dataloaders.ShoppingListLoader.load(id);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new ShoppingList(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) => dataloaders.ShoppingListLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: IShoppingList) => dataloaders.ShoppingListLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: IShoppingList) => clearCache(context, id) && primeCache(context, id, data);

type ShoppingListArgs = ConnectionArguments & {
  search?: string;
};
export const loadUserShoppingList = async (context: GraphQLContext, args: ShoppingListArgs) => {
  const shoppingLists = ShoppingListModel.find({
    user: new Types.ObjectId(args.userId)
  }, { _id: 1 });

  return connectionFromMongoCursor({
    cursor: shoppingLists,
    context,
    args,
    loader: load,
  });
};

export const loadShoppingLists = async (context: GraphQLContext, args: ShoppingListArgs) => {
  const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const shoppingLists = ShoppingListModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: shoppingLists,
    context,
    args,
    loader: load,
  });
};
