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
// var http = require('http');
var port = process.env.PORT || 8080;

app.get('/',function(req, res) {
    story.requestStories(function(stories){
        // var html = "";
        //     for (var s = 0; s < 10; s++) {
        //         var story = stories[s];
        //         html += '<li><a href=' +story['url']+'>'+story['title']+'</li>'
        //         var storyDiv = document.getElementById("stories");
        //         var listItem = document.createElement('li');
        //         var link = document.createElement('a');
        //         link.href = story['url'];
        //         link.innerText = story['title'];
        //         listItem.appendChild(link);
        //         storyDiv.appendChild(listItem);
        //     }
        // res.set('Content-Type', 'text/html; charset=utf-8');
        // res.writeHead(200);
        var storyarray = Object.values(stories);
        res.render('index',{ stories: storyarray });
    });
});

app.listen(port);
