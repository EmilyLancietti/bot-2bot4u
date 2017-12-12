'use strict';

var nodemailer = require("nodemailer");

module.exports = function (user) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "searchmove.info@gmail.com", // generated ethereal user
            pass: "Qwertyuiop!" // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    var mailOptions = {
        from: '"SearchMove" <searchmove.info@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: 'SearchMove Email Confirmation', // Subject line
        text:
        "Ciao " + user.full_name + ",\n\n" +
        "Attiva il tuo account andando al seguente link: https://2bot4u.github.io/email_verification.html?code=" + user.confirmation_code + "&email=" + user.email
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
    });
};
