// @flow
import DataLoader from 'dataloader';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';

import type { ObjectId } from 'mongoose';
import type { ConnectionArguments } from 'graphql-relay';

import UserModel from './UserModel';

import type { GraphQLContext } from '../../TypeDefinition';

type UserType = {
  id: string,
  _id: string,
  name: string,
  password: string,
  email: string,
  active: boolean,
};

export default class User {
  id: string;
  _id: string;
  name: string;
  email: string;
  active: boolean;

  constructor(data: UserType, { user }: GraphQLContext) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;

    // you can only see your own email, and your active status
    if (user && user._id.equals(data._id)) {
      this.email = data.email;
      this.active = data.active;
    }
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(UserModel, ids));

const viewerCanSee = (/* context, data */) => true;

export const load = async (context: GraphQLContext, id: string): Promise<?User> => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.UserLoader.load(id);
  } catch (err) {
    return null;
  }
  return viewerCanSee(context, data) ? new User(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: ObjectId) =>
  dataloaders.UserLoader.clear(id.toString());
export const primeCache = ({ dataloaders }: GraphQLContext, id: ObjectId, data: UserType) =>
  dataloaders.UserLoader.prime(id.toString(), data);
export const clearAndPrimeCache = (context: GraphQLContext, id: ObjectId, data: UserType) =>
  clearCache(context, id) && primeCache(context, id, data);

export const loadUsers = async (context: GraphQLContext, args: ConnectionArguments) => {
  const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  const users = UserModel.find(where, { _id: 1 }).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: users,
    context,
    args,
    loader: load,
  });
};