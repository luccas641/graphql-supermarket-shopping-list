import mongoose, { Document, Model } from 'mongoose';
var Schema = mongoose.Schema;

export type ShoppingItem = {
  productId: Number
  quantity: Number
}

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{
      productId: Number,
      quantity: Number,
    }]
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'shoppingList',
  },
);

export interface IShoppingList extends Document {
  name: string;
  user;
  items: Array<ShoppingItem>;
}

// this will make find, findOne typesafe
const ShoppingListModel: Model<IShoppingList> = mongoose.model('ShoppingList', schema);

export default ShoppingListModel;
