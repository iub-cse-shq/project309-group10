var mongoose = require('mongoose');
const mart = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    quantity: { type: String, required: true },
    category:{ type: String, required: true },
    price: { type: String, required: true }
   })
   var martSchema = mongoose.model('martProduct', mart);
   module.exports = martSchema;
