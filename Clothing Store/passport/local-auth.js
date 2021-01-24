const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
var customerAccount = require('../models/customerSchema');
var adminAccount = require('../models/adminSchema');

module.exports = function(passport) {
    passport.use('customer',new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Match user
        customerAccount.findOne({
          email: email
        }).then(user => {
          if (!user) {
            return done(null, false, { message: 'That email is not registered' });
          }
  
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        });
      })      
    )
    passport.use('admin',new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      adminAccount.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })      
  )
  
    passport.serializeUser(function(user, done) {
      done(null, {id:user.id, type:user.type});
    });
  
    passport.deserializeUser(function(obj, done) {
      /*
      customerAccount.findById(id, function(err, user) {
        done(err, user);
      });

      */
     switch (obj.type) {
      case 'customer':
          customerAccount.findById(obj.id)
              .then(user => {
                  if (user) {
                      done(null, user);
                  }
                  else {
                      done(new Error('customer id not found:' + obj.id, null));
                  }
              });
          break;
      case 'admin':
          adminAccount.findById(obj.id)
              .then(device => {
                  if (device) {
                      done(null, device);
                  } else {
                      done(new Error('admin id not found:' + obj.id, null));
                  }
              });
          break;
      default:
          done(new Error('no entity type:', obj.type), null);
          break;
  }






    });



  };