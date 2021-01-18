var mongoose = require('mongoose');
const martSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
   })
   var martProduct = mongoose.model('martProduct', martSchema);
   module.exports = martProduct;
