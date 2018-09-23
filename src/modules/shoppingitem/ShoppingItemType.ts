import { GraphQLObjectType, GraphQLInt } from 'graphql';
import { registerType } from '../../interface/NodeInterface';

import ProductType from '../product/ProductType'
import {load} from '../product/ProductLoader'

const ShoppingItemType = registerType(
  new GraphQLObjectType({
    name: 'ShopppingItem',
    description: 'ShopppingItem',
    fields: () => ({
      product: {
        type: ProductType,
        resolve: async (item, args, context) => {
          return load(context, {id: item.productId})
        }
      },
      quantity: {
        type: GraphQLInt
      }
    })
  }) 
)

export default ShoppingItemType