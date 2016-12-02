exports.requestStories = function(onStoryListComplete) {
    "use strict"
    var https = require('https');
    var assert = require('chai').assert;

// get top story ids
    var options = {
        host: 'hacker-news.firebaseio.com',
        path: '/v0/topstories.json'
    };

    var callback = function (response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            var json = JSON.parse(str);
            var storylist = {};
            // storylist["comments"] = {};
            var jsonLength = json.length;

            // Unit Test: always have > 0 stories
            assert(jsonLength > 0, "jsonLength is 0");

            // account for case where there isn't 10 stories
            var storiesLength = 10
            if (jsonLength < 10){
                storiesLength = jsonLength;
            };

            // Unit Test: always have <= 10 stories
            assert(storiesLength <= 10, "storiesLength is greater than 10");

            for (var i = 0; i < storiesLength; i++) {
                var post = json[i];
                console.log(post);

                // get top stories
                var options = {
                    host: 'hacker-news.firebaseio.com',
                    path: '/v0/item/' + post + '.json'
                };
                var callback = (function (j) {
                    return function (response) {
                        var story = '';

                        //another chunk of data has been recieved, so append it to `str`
                        response.on('data', function (chunk) {
                            story += chunk;
                        });
                        response.on('end', function () {
                            storylist[j] = JSON.parse(story);

                            // grab top comment for the story if exists
                            // method fails if no comments or if last story doesn't have comment?

                            if (storylist[j]['kids']) {

                                // get comments
                                var options = {
                                    host: 'hacker-news.firebaseio.com',
                                    path: '/v0/item/' + storylist[j]['kids'][0] + '.json'
                                };
                                var callback = function (response) {
                                    var comment = '';
                                    response.on('data', function (chunk) {
                                        comment += chunk;
                                    });
                                    response.on('end', function () {
                                        storylist[j]["comments"] = JSON.parse(comment);

                                        // check if we have all stories
                                        if (storiesLength == Object.keys(storylist).length) {
                                            console.log("all stories");
                                            var commentNum = 0;

                                            // loop through keys to check for comments
                                            for (var k = 0; k < storiesLength; k++) {
                                                if (storylist[k]["comments"]) {
                                                    commentNum +=1;
                                                    console.log(commentNum);
                                                };
                                            };

                                            // check if we have as many comments as stories
                                            if (storiesLength == commentNum){
                                                // yay, now we send over to main.js
                                                console.log("all comments");

                                                // loop through keys to trim each URL
                                                for (var k = 0; k < storiesLength; k++) {

                                                    // ask HN and stuff don't have URLs, so check for it
                                                    if (storylist[k]["url"]){
                                                        var url = storylist[k]["url"];
                                                        var urlNoProtocol = url.replace(/^https?\:\/\//i, "");
                                                        var urlBase = urlNoProtocol.replace(/(\/\/[^\/]+)?\/.*/, '$1');
                                                        storylist[k]["url"] = urlBase;
                                                    }
                                                };
                                                onStoryListComplete(storylist);
                                            }
                                        };
                                    })
                                };
                                https.request(options, callback).end();
                            } else {
                                storylist[j]["comments"] = 'none';
                            };
                        });
                    };
                })(i);
                https.request(options, callback).end();
            };
        });
    }
    https.request(options, callback).end();
}