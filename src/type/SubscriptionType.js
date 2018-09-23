// external imports
import { GraphQLObjectType } from 'graphql';

import UserSubscriptions from '../modules/user/subscription';
import ShoppingListSubscriptions from '../modules/shoppinglist/subscription';

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    ...UserSubscriptions,
    ...ShoppingListSubscriptions
  },
});
