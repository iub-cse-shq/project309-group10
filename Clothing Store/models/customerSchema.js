var mongoose = require('mongoose');


const person = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true }
   })

  
   var customerSchema = mongoose.model('customer', person);
  
   module.exports = customerSchema;
