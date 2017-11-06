// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var path = require('path');
mongoose.connect('mongodb://localhost:27017/messages');

var Message     = require('./app/models/message');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// sends main html page for the messaging board
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/messaging.html'));
    //console.log(req);
});

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
router.route('/messages')
    // create message
    .post(function(req, res) {
        var message = new Message();      
        message.content = req.body.content;  // set message text
        message.course = req.body.course;
        message.timestamp = new Date().getTime();
        // save the message and check for errors
        message.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Message delivered!' });
        });

    })
    // get messages
    .get(function(req, res) {
        Message.find(function(err, messages) {
            if (err)
                res.send(err);
            res.json(messages);
        });
    });

router.route('/messages/:course')

    // get the message associated with the course
    .get(function(req, res) {
        Message.find({"course":req.params.course}, function(err, messages) {
            if (err)
                res.send(err);
            res.json(messages);
        });
    });

    
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

// Functions