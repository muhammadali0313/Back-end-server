const orderSchema = new Schema({
  user: {
     type: Schema.Types.ObjectId,
      ref: 'User' 
    },
  products: [{
     type: Schema.Types.ObjectId,
      ref: 'Product' 
    }],
  totalPrice: Number,
  orderDate: {
     type: Date,
      default: Date.now 
    },
  status: {
     type: String,
      default: 'pending' 
    },
});
const Order = mongoose.model('Order', orderSchema);
