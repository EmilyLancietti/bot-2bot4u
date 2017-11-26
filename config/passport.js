var env = process.env.NODE_ENV || 'development';
var configAuth = require('./auth')[env];

var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;

var async = require('async');
var randtoken = require('rand-token');

var password_utility = require('../modules/password_utility');

var models = require('../models');

module.exports = function (passport) {


    //TODO Proa con chest module.exports = function(passport, user)
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and de-serialize users out of session


    passport.serializeUser(function(results, done) {
        console.log("SERIALIZE", results.user.email);
        var sessionUser = {_id: results.user.email, full_name: results.user.full_name, token: results.token, admin: results.user.admin};
        console.log(sessionUser);
        done(null, sessionUser);
    });

   passport.deserializeUser(function(id, done) {
       console.log("DESERIALIZE " +  id);
       models.User
           .findById(id, function(err, user) {
           done(err, user);
       });
   });



    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    var localSignupOptions = {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    };

    passport.use('localSignup', new localStrategy(localSignupOptions, function (req, email, password, done) {

       console.log('entering signup from passport signup strategy');

       console.log('controllo che l\'utente non sia gia registrato con email: ' + email);
       models.User
           .findById(email)
           .then(function(user) {
               // L'utente è già registrato
               if (user !== null) {
                   console.log('Utente gia registrato');
                   return done(null, false);
               }
               else {
                   console.log('utente non ancora registrato: inserimento nel database:');
                   async.waterfall([
                       function(next) {
                        console.log('encrypt password...');
                            password_utility.cryptPassword(password, function (err, password) {
                                if(err) {
                                    console.log('error password encrypt');
                                    next(err);
                                }
                                else {
                                    next(null, password);
                                }
                            });
                       },
                       // creazione utente
                       function (password, next) {
                           console.log('creazione dell\'utente...');
                           models.User
                               .create({
                                   full_name: req.body.full_name,
                                   email: email,
                                   password: password
                               })
                               .then(function(user) {
                                   console.log('utente creato.');
                                   next(null, user);
                               })
                               .catch(function(err) {
                                   console.log('errore nella creazione dell\'utente');
                                   next(err);
                               });
                       },
                       // creazione token
                       function (user, next) {
                            console.log('creazione token...');
                            models.Token
                                .create({
                                    token: randtoken.generate(188),
                                    type: 'Interno',
                                    user_id: user.email
                                })
                                .then(function(token) {
                                    console.log('token creato.');
                                    next(null, {user: user, token: token});
                                })
                                .catch(function(err) {
                                    console.log('errore nella creazione del token');
                                    next(err);
                                });
                       }
               ], function(err, results) {
                           if (err) {
                               console.log('errori nel waterfall');
                               return done(err);
                           }
                           else {
                               console.log('utente: ' + results.user);
                               console.log('token: ' + results.token);
                               return done(null, results);
                           }
                       }


                   );
               }
           })

    }));


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    var localLoginOptions = {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    };

    passport.use('localLogin', new localStrategy(localLoginOptions, function (req, email, password, done) {
        console.log('entering login from passport login strategy');
        console.log('controllo che l\'utente sia gia registrato con email: ' + email);
        models.User
            .findById(email)
            .then(function (user) {
                // L'utente non è registrato
                if (user === null) {
                    console.log('Utente non registrato');
                    return done(null, false);
                }
                else {
                    console.log('utente gia registrato: controllo password...:');
                    password_utility.comparePassword(password, user.password, function (isPasswordMatch) {
                        // password corretta
                        if (isPasswordMatch) {
                            console.log('password corretta');

                            //cerco token interno

                            models.Token
                                .findOne({
                                    where: {
                                        type: 'Interno',
                                        user_id: user.email
                                    }
                                })
                                .then(function(foundToken) {
                                    //token interno non trovato
                                    if(foundToken === null) {
                                        console.log('Token interno non esistente');
                                        return done(null, {user:user, token : null});
                                    }
                                    // token interno trovato
                                    else {
                                        console.log('token trovato');
                                        return done(null, {user: user, token : foundToken});
                                    }
                                })
                                .catch(function(err) {
                                    console.log('errore durante la ricerca del token interno ' + err);
                                    return done(err);
                                });


                        }
                        // password sbagliata
                        else {
                            console.log('password errata');
                            return done(null, false);
                        }
                    });
                }
            })
            .catch(function (err) {
                console.log('errore query');
                return done(err);
            });
    }));


    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================


    var googleLoginOptions = {
        // pull in our app id and secret from our auth.js file
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    };

    passport.use('googleLogin', new googleStrategy(googleLoginOptions, function (token, refreshToken, profile, done) {
        // FIXME Google non riconosce l'email con i punti
        console.log('entering google from passport google strategy') ;
        var email = profile.emails[0].value;

        console.log('controllo che l\'utente sia gia registrato con email ' + email);
        models.User
            .findById(email)
            .then(function(user) {
                // l'utente non è registrato
                if(user === null) {
                    console.log('Utente non registrato');
                    return done(null, false);
                }
                else {
                    console.log('utente gia registrato: cerco/creo token google...:');
                    models.Token
                        .findOne({
                            where: {
                                type: 'Google',
                                user_id: user.email
                            }
                        })
                        .then(function(foundToken) {
                            // token non trovato
                            if(foundToken === null) {
                                console.log('token facebook non trovato.');
                                console.log('creazione token google...');

                                models.Token
                                    .create({
                                        type: 'Google',
                                        user_id: user.email,
                                        // TODO: inserimento/controllo refresh token
                                        token: token,
                                        data: profile
                                    })
                                    .then (function(newToken) {
                                        console.log('token creato ' + newToken);
                                        return done(null, {user: user, token: newToken});
                                    })
                                    .catch(function(err){
                                        console.log('errore durante la creazione del token');
                                        return done(err);
                                    });
                            }
                            //token trovato
                            else {
                                console.log('token google trovato ' + foundToken);
                                return done(null, {user: user, token: foundToken});
                            }
                        })
                        .catch(function(err) {
                            console.log('errore nella ricerca dell token');
                            return done(err);
                        });
                }
            })
            .catch(function(err) {
                console.log('errore nella ricerca dell\'utente');
                return done(err);
            });
    }));


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================


    var facebookLoginOptions = {
        // pull in our app id and secret from our auth.js file
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: configAuth.facebookAuth.profileFields
    };

    passport.use('facebookLogin', new facebookStrategy(facebookLoginOptions, function (token, refreshToken, profile, done) {

        console.log('entering facebook from passport facebook strategy') ;
        var email = profile.emails[0].value;

        console.log('controllo che l\'utente sia gia registrato con email ' + email);
        models.User
            .findById(email)
            .then(function(user) {
                // l'utente non è registrato
                if(user === null) {
                    console.log('Utente non registrato');
                    return done(null, false);
                }
                else {
                    console.log('utente gia registrato: cerco/creo token facebook...:');
                    models.Token
                        .findOne({
                            where: {
                                type: 'Facebook',
                                user_id: user.email
                            }
                        })
                        .then(function(foundToken) {
                            // token non trovato
                            if(foundToken === null) {
                                console.log('token facebook non trovato.');
                                console.log('creazione token facebook...');

                                models.Token
                                    .create({
                                        type: 'Facebook',
                                        user_id: user.email,
                                        // TODO: inserimento/controllo refresh token
                                        token: token,
                                        data: profile
                                    })
                                    .then (function(newToken) {
                                        console.log('token creato ' + newToken);
                                        return done(null, {user: user, token: newToken});
                                    })
                                    .catch(function(err){
                                        console.log('errore durante la creazione del token');
                                        return done(err);
                                    });
                            }
                            //token trovato
                            else {
                                console.log('token facebbok trovato ' + foundToken);
                                return done(null, {user: user, token:foundToken});
                            }
                        })
                        .catch(function(err) {
                           console.log('errore nella ricerca dell token');
                           return done(err);
                        });
                }
            })
            .catch(function(err) {
               console.log('errore nella ricerca dell\'utente');
               return done(err);
            });
    }));

};
