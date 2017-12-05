'use strict';

var response = require('../modules/json_response');

var express = require('express');
var router = express.Router();

module.exports = function (passport) {
    // =====================================
    // SIGNUP ROUTES =======================
    // =====================================
    router.post('/signup', function (req, res, next) {
        // Custom callback
        passport.authenticate('localSignup', function (err, user, info) {
            if (err) {
                response(res, err, 401);
            }
            if (!user) {
                console.log(info);
                response(res, info, 400);
            } else {
                req.login(user, function (loginErr) {
                    if (loginErr) {
                        response(res, loginErr, 401);
                    }
                    response(res, req.user.token.token, 201);
                });
            }
        })(req, res, next);
    });


    // =====================================
    // LOGIN ROUTES ========================
    // =====================================
    router.post('/login', function (req, res, next) {
        // Custom callback
        passport.authenticate('localLogin', function (err, user, info) {
            if (err) {
                response(res, err, 401);
            }
            if (!user) {
                response(res, info, 400);
            } else {
                req.login(user, function (loginErr) {
                    if (loginErr) {
                        response(res, loginErr, 401);
                    }
                    response(res, req.user.token.token, 200);
                });
            }
        })(req, res, next);
    });


    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    router.get('/auth/google', passport.authenticate('googleLogin', {
        scope: ['profile', 'email']
    }));


    router.get('/auth/google/callback', function (req, res, next) {
        // Custom callback
        passport.authenticate('googleLogin', function (err, user, info) {
            if (err) {
                response(res, err, 401);
            }
            if (!user) {
                response(res, info, 400);
            } else {
                req.login(user, function (loginErr) {
                    if (loginErr) {
                        response(res, loginErr, 401);
                    }
                    res.redirect("https://2bot4u.github.io/sociallogin.html?token=" + req.user.token.token);
                });
            }
        })(req, res, next);
    });


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    router.get('/auth/facebook', passport.authenticate('facebookLogin', {
        scope: ['public_profile', 'email']
    }));

    router.get('/auth/facebook/callback', function (req, res, next) {
        // Custom callback
        passport.authenticate('facebookLogin', function (err, user, info) {
            if (err) {
                response(res, err, 401);
            }
            if (!user) {
                response(res, info, 400);
            } else {
                req.login(user, function (loginErr) {
                    if (loginErr) {
                        response(res, loginErr, 401);
                    }
                    res.redirect("https://2bot4u.github.io/sociallogin.html?token=" + req.user.token.token);
                });
            }
        })(req, res, next);
    });


    // =====================================
    // LOGOUT ==============================
    // =====================================
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('https://2bot4u.github.io/logout.html');
    });

    return router;
};
