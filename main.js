/**
 * Created by Catherine on 11/19/16.
 */

"use strict";
var helmet = require('helmet');
var express = require('express');
var app = express();
app.use(helmet());
var mustacheExpress = require('mustache-express');

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

var punctuation = require('./request');
var port = process.env.PORT || 8080;

app.get('/',function(req, res) {
    var callArray = ['Next calling Bill dot com this is DJ speaking Help me help you hi I\'m interested in ordering a toilet and you live here in New York and I wanted to know how long it would take to receive ok yeah what toilet are you looking at color twenty three nine four nine fourteen inch ruff and he led me to do ship out today if we want to within the next like hour or so and look at about three three days for transit time so you get him by the end of the week ok what do you take in payment pay pal discover mass card Amex meet amazon payments ok you get to be done that and you want the wax ring with that yeah you can give me the wax ring with that last ring and I have pretty much if you want the toilet seat','hi this is molly welcome to build how can I help you today yes I was looking to return an order'];
    var keywordArray = ['order','tracking','ordering','payment','ship','shipping','return','looking'];
    punctuation.requestPunctuatedText(callArray, keywordArray, function(punctuatedArray) {
        res.render('index',{ originalText: callArray.reverse(), punctuatedText: punctuatedArray.reverse() });
    });
});

app.listen(port);


