import { PubSub } from 'graphql-subscriptions';

export const EVENTS = {
  USER: {
    ADDED: 'USER_ADDED',
  },
  SHOPPING_LIST: {
    CREATED: 'SHOPPING_LIST_CREATED',
    CHANGED: 'SHOPPING_LIST_CHANGED',
    REMOVED: 'SHOPPING_LIST_REMOVED',
  },
};

export default new PubSub();
