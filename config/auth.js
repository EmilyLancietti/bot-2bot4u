module.exports = {
    development: {
        facebookAuth: {
            clientID: '132359937482011',
            clientSecret: 'd6b732813a145693311153632300d819',
            callbackURL: 'http://localhost:3000/passport/auth/facebook/callback',
            profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
            profileFields: ['id', 'email', 'name'] // For requesting permissions from Facebook API
        },
        googleAuth: {
            clientID: '247826752010-10ecu6m3obsgctp77dn9s75ii59do7fr.apps.googleusercontent.com',
            clientSecret: 'segpj37Ltf1Pww3vD6o3Jze8',
            callbackURL: 'http://localhost:3000/passport/auth/google/callback'
        }
    },
    test: {
        facebookAuth: {
            clientID: process.env.FB_CLIENTID,
            clientSecret: process.env.FB_CLIENTSECRET,
            callbackURL: 'https://bot-2bot4u-test.herokuapp.com/auth/facebook/callback',
            profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
            profileFields: ['id', 'email', 'name'] // For requesting permissions from Facebook API
        },
        googleAuth: {
            clientID: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_CLIENTSECRET,
            callbackURL: 'https://bot-2bot4u-test.herokuapp.com/auth/google/callback'
        }
    },
    production: {
        facebookAuth: {
            clientID: process.env.FB_CLIENTID,
            clientSecret: process.env.FB_CLIENTSECRET,
            callbackURL: 'https://bot-2bot4u.herokuapp.com/auth/facebook/callback',
            profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
            profileFields: ['id', 'email', 'name'] // For requesting permissions from Facebook API
        },
        googleAuth: {
            clientID: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_CLIENTSECRET,
            callbackURL: 'https://bot-2bot4u.herokuapp.com/auth/google/callback'
        }
    }
};
