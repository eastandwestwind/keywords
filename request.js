exports.requestStories = function(onStoryListComplete) {
    "use strict"
    var https = require('https');
    var assert = require('chai').assert;

//The url we want is: 'https://hacker-news.firebaseio.com/v0/topstories.json'
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
                console.log(json[i]);
                var options = {
                    host: 'hacker-news.firebaseio.com',
                    path: '/v0/item/' + json[i] + '.json'
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
                            console.log(Object.keys(storylist).length);
                            console.log(storylist);
                            if (storiesLength == Object.keys(storylist).length) {
                                onStoryListComplete(storylist);
                            }
                        });
                    };
                })(i);
                https.request(options, callback).end();
            }
            ;
        });
    }
    https.request(options, callback).end();
}