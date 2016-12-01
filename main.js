/**
 * Created by Catherine on 11/19/16.
 */

"use strict"
var helmet = require('helmet')
var express = require('express')
var app = express()
app.use(helmet())
var assert = require('chai').assert
var mustacheExpress = require('mustache-express');

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

var story = require('./request');
var port = process.env.PORT || 8080;

app.get('/',function(req, res) {
    story.requestStories(function(stories){
        var storyarray = Object.values(stories);
        res.render('index',{ stories: storyarray });
    });
});

app.listen(port);
