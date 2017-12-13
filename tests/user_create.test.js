var models = require('../models');
var randtoken = require('rand-token');

test('Creazione utente', function () {
    models.User
        .create({
            full_name: "Utente di Test",
            email: "test@email.com",
            password: "12345",
            confirmation_code: randtoken.generate(32)
        })
        .then(function (user) {
            expect(user.email).toBe("test@email.com");
        });
});
