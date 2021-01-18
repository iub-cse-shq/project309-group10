var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = http.Server(app);
var martPro = require('./dbSchema');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//DB connection
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var dbURL = 'mongodb://localhost:27017/martProduct' //change this if we are using Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (!err) { console.log('MongoDB Connection Succeeded.'); }
  else { console.log('Error in DB connection due to :' + err); }
});


app.get('/newProduct', function (request, response) {
  response.render('newProduct.ejs', {
  })

})

app.get('/cart', function (request, response) {
  martPro.find({}, function (err, data) { response.render('cart', { products: data }) })
})

app.post('/newProduct', function (request, response) {
  var newMartProduct = new martPro(request.body)
  newMartProduct.save(function (err, data) {
    if (err)
      return response.status(400).json({
        error: 'required product data is missing'
      })
    return response.status(200).json({
      message: 'Product data inserted into database successfully'
    })
  })
})

app.get('/', function (request, response) {
  martPro.find({}, function (err, data) { response.render('StoreFront.ejs', { products: data }) })
})


app.get('/productDetail/:id', function (request, response) {
  martPro.findById(request.params.id, function (err, data) {
    response.render('productDetail.ejs', { individualProduct: data })
  })
})

app.post('/cart', function (request, respond) {
  const data = request.body;
  martPro.findByIdAndUpdate(data.id , { quantity: data.quantity }, {useFindAndModify: false}, function (err, result) {
    if (err) {
      respond.send(err);
    }
    else {
      respond.send(result);
    }
  })

});


app.delete('/cart/:id', function (request, respond) {
  martPro.findByIdAndDelete(request.params.id, function (err,result) {
    if (err) {
      respond.send(err);
    }
    else {
      respond.send(result);
    }
  });

});


//starting the server to listen to port 3000 at localhost
server.listen(process.env.PORT || 3000,
  process.env.IP || 'localhost', function () {
    console.log('Server running');
  })
module.exports = { app, server, mongoose };