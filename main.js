/**
 * Created by Catherine on 11/19/16.
 */

var story = require('./request');
var http = require('http');

var server = http.createServer(function(req, res) {
    story.requestStories(function(stories){
        var html = "";
            for (var s = 0; s < 10; s++) {
                story = stories[s];
                html += '<li><a href=' +story['url']+'>'+story['title']+'</li>'
                // var storyDiv = document.getElementById("stories");
                // var listItem = document.createElement('li');
                // var link = document.createElement('a');
                // link.href = story['url'];
                // link.innerText = story['title'];
                // listItem.appendChild(link);
                // storyDiv.appendChild(listItem);
            }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.writeHead(200);
        res.end(html);
    });
});
server.listen(8080);
