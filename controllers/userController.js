var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User.model');

passport.use(new LocalStrategy(
    function(username, password, done){
        User.getUserByUsername(username, function(err, user){
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    })
);

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.getUserById(id, function(err, user){
        done(err, user);
    });
});

router

    // Creates a new User
    .post('/', (req, res) => {
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('email', 'E-Mail is required').notEmpty();
        
        const errors = req.validationErrors();
        
        if (errors) {
            res.status(500).send(errors);
        } else {
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
                name: req.body.name,
                email: req.body.email
            });
            User.createUser(newUser, (err, savedUser) => {
                if (err) return res.status(500).send('requesterror');
                return res.status(200).send(savedUser);
            });
        }
    })

    // Removes user by username
    .post('/remove/:username', (req, res) => {
        const query = { username: req.params['username'] };
        User.deleteUser(query, (err, deletedUser) => {
            if (err) return res.status(500).send('user could not been deleted');
            return res.status(200).send(deletedUser);
        });
    })

    // Login user to server session
    .post('/login', 
        passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', }), 
        (req, res, next) => {
            res.redirect('/');
        }
    )
    
    // Logout user
    .get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
        
module.exports = router;