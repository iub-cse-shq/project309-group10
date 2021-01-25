var mongoose = require('mongoose');
const cart = new mongoose.Schema({
    type:{ type: String, required: true },
    userId:{ type: String, required: true },
    cartItemName: { type: String, required: true },
    cartDescription: { type: String, required: true },
    cartUrl: { type: String, required: true },
    cartQuantity: { type: String, required: true },
    cartCategory:{ type: String, required: true },
    cartPrice: { type: String, required: true }
   })
   var cartSchema = mongoose.model('cartProduct', cart);
   module.exports = cartSchema;