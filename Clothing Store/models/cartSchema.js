var mongoose = require('mongoose');
const cart = new mongoose.Schema({
    type:{ type: String, required: true },
    usermail:{ type: String, required: true },
    cartName: { type: String, required: true },
    cartDescription: { type: String, required: true },
    cartUrl: { type: String, required: true },
    cartQuantity: { type: Number, required: true },
    cartCategory:{ type: Number, required: true },
    cartPrice: { type: Number, required: true }
   })
   var cartSchema = mongoose.model('cartProduct', cart);
   module.exports = cartSchema;