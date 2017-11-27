'use strict';

var express = require('express');
var router = express.Router();

module.exports = function (passport) {
    // =====================================
    // SIGNUP ROUTES =======================
    // =====================================
    router.get('/signup', function (req, res) {
        res.render('signup.ejs');
    });

    router.post('/signup', passport.authenticate('localSignup', {
        successRedirect: '/passport',
        failureRedirect: '/passport/login'
    }));


    // =====================================
    // LOGIN ROUTES ========================
    // =====================================
    router.get('/login', function (req, res) {
        res.render('login.ejs');
    });

    router.post('/login', passport.authenticate('localLogin', {
        failureRedirect: '/passport'
    }), function (req, res) {
        // Qui entra solo se autenticato
        console.log(req.user);
        res.render('profile.ejs', {
            user: req.user
        });
    });


    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    router.get('/auth/google', passport.authenticate('googleLogin', {
        scope: ['profile', 'email']
    }));

    /* // handle the callback after facebook has authenticated the user
     router.get('/auth/google/callback', passport.authenticate('googleLogin', {
         successRedirect: '/passport/profile',
         failureRedirect: '/passport'
     }));*/

    router.get('/auth/google/callback', passport.authenticate('googleLogin', {
        failureRedirect: '/passport'
    }), function (req, res) {
        // Qui entra solo se autenticato
        console.log(req.user);
        res.render('profile.ejs', {
            user: req.user
        });
    });


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    router.get('/auth/facebook', passport.authenticate('facebookLogin', {
        scope: ['public_profile', 'email']
    }));

    /*router.get('/auth/facebook/callback',
        passport.authenticate('facebookLogin', {
                successRedirect: '/passport/profile',
                failureRedirect: '/passport'
            })
    );*/


    router.get('/auth/facebook/callback', passport.authenticate('facebookLogin', {
        failureRedirect: '/passport'
    }), function (req, res) {
        // Qui entra solo se autenticato
        console.log(req.user);
        res.render('profile.ejs', {
            user: req.user
        });
    });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/passport/');
    });


    // =====================================
    // INDEX ===============================
    // =====================================
    router.get('/', function (req, res) {
        res.render('index.ejs');
    });

    return router;
};
