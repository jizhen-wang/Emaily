const passport = require('passport');

module.exports = app => {
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email'],
        }));

    app.get('/auth/google/callback', passport.authenticate('google'),
        (req, res) => {
            res.redirect('/surveys');
        });

    app.get(
        '/auth/facebook',
        passport.authenticate('facebook', {
            scope: ['public_profile']
        }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }),
        (req, res) => {
            // Successful authentication, redirect home.
            res.redirect('/surveys');
        });

    app.get('/api/logout', (req, res) => {
        req.logout()
        res.redirect('/');
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

    app.get('/', (req, res) => {
        res.send("<h1>Hello</h1>");
    });


};