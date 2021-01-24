var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = http.Server(app);
var session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const bcrypt = require('bcrypt');

var customerAccount = require('./models/customerSchema');
var adminAccount = require('./models/adminSchema');
var martPro = require('./models/martSchema');
var cartPro = require('./models/cartSchema');

app.use(express.static('public'));
app.set('view engine', 'ejs');

require('./passport/local-auth')(passport);


app.use(session({ secret: "656gfgf434sd", resave: false, saveUninitialized: true }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//require('./passport/local-auth')(passport)



//DB connection
var mongoose = require('mongoose');
mongoose.Promise = global.Promise
var dbURL = 'mongodb://localhost:27017/clothingStore' //change this if we are using Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (!err) { console.log('MongoDB Connection Succeeded.'); }
  else { console.log('Error in DB connection due to :' + err); }
});


app.get('/newProduct', function (request, response) {
  response.render('newProduct.ejs', {
  })

})

app.get('/customerRegistration', function (request, response) {
  response.render('customerRegistration.ejs', {
  })

})
app.get('/adminRegistration',  checkAuthenticated, function (request, response) {
  response.render('adminRegistration.ejs', {
  })

})

app.get('/customerLogin', function (request, response) {
  response.render('customerLogin.ejs', {
  })

})
app.get('/adminLogin', function (request, response) {
  response.render('adminLogin.ejs', {
  })

})
app.get('/adminCart', checkAuthenticated, function (request, response) {
  martPro.find({}, function (err, data) { response.render('adminCart', { products: data }) })
})

app.get('/cart', checkAuthenticated, function (request, response) {
  martPro.find({}, function (err, data) { response.render('cart', { products: data }) })
})

app.post('/newProduct', function (request, response) {
  console.log(request.body)
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

app.post('/customerRegistration', async (request, response)=> {
  
   try{
    const hashedPassword = await bcrypt.hash(request.body.password, 10)
    request.body.password=hashedPassword;
    
    var newCustomer = new customerAccount(request.body)
    newCustomer.save(function (err, data) {
      if (err) { return next(err) }
      request.flash('success_message','You have registered, Now please login');
      response.redirect('/customerLogin')
    })
  }catch{
    response.redirect('/')
  }
  
})



app.post('/adminRegistration', async (request, response) => {
  try{
    const hashedPassword = await bcrypt.hash(request.body.password, 10)
    request.body.password=hashedPassword;
    var newAdmin = new adminAccount(request.body)
    newAdmin.save(function (err, data) {
      if (err) { return next(err) }
      response.redirect('/adminLogin')
    })
  }catch{
    response.redirect('/')
  }
})

app.post('/admin', function (request, response) {
  console.log(request.body)
 
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
  martPro.findByIdAndUpdate(data.id, { quantity: data.quantity }, { useFindAndModify: false }, function (err, result) {
    if (err) {
      respond.send(err);
    }
    else {
      respond.send(result);
    }
  })

});


app.delete('/cart/:id', function (request, respond) {
  martPro.findByIdAndDelete(request.params.id, function (err, result) {
    if (err) {
      respond.send(err);
    }
    else {
      respond.send(result);
    }
  });

});

app.post('/adminLogin', (req, res, next) => {passport.authenticate('admin', {
  successRedirect: '/admin',
  failureRedirect: '/adminLogin',
  failureFlash: true
})(req, res, next);
});



app.post('/customerLogin', (req, res, next) => {passport.authenticate('customer', {
  successRedirect: '/customer',
  failureRedirect: '/customerLogin',
  failureFlash: true
})(req, res, next);
});









app.get('/customer', checkAuthenticated, (request, response) => {
  martPro.find({}, function (err, data) { response.render('customer.ejs', { products: data }) })
});

app.get('/admin', checkAuthenticated, (request, response) => {
  martPro.find({}, function (err, data) { response.render('admin.ejs', { products: data }) })
});


function checkAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return next()
  }
  response.redirect('/')
}



app.delete('/logout', (request,response)=>{
  request.logOut()
  request.redirect('/')
})



//starting the server to listen to port 3000 at localhost
server.listen(process.env.PORT || 3000,
  process.env.IP || 'localhost', function () {
    console.log('Server running');
  })
module.exports = { app, server, mongoose };