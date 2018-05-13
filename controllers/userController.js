var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var User = require('../models/User.model');

router
    
    // Find an user
    .get('/', (req, res) => {
        const query = req.query;
        User.getUser(query, (err, user) => {
            if (err) return res.status(500).send('requesterror');
            return res.status(200).send(user);
        });
    })

    // Add a new user to the DB
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
        
module.exports = router;