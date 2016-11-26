var https = require('https');

//The url we want is: 'https://hacker-news.firebaseio.com/v0/topstories.json'
    var options = {
        host: 'hacker-news.firebaseio.com',
        path: '/v0/topstories.json'
    };

callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        var json = JSON.parse(str);
        var storylist = {};
        for (var i = 0; i < 10 && i < json.length; i++) {
            var post = json[i];
            console.log(json[i]);
            var options = {
                host: 'hacker-news.firebaseio.com',
                path: '/v0/item/' + json[i] +'.json'
            };
            callback = (function(j){
                return function(response) {
                    var story = '';
                    //another chunk of data has been recieved, so append it to `str`
                    response.on('data', function (chunk) {
                        story += chunk;
                    });
                    response.on('end', function () {
                        storylist[j] = story;
                        console.log(Object.keys(storylist).length);
                        console.log(storylist);
                        if (10 == Object.keys(storylist).length) {
                            for (var s = 0; s < 10; s++) {
                                story = JSON.parse(storylist[s]);
                                var storyDiv = document.getElementById("stories");
                                var listItem = document.createElement('li');
                                var link = document.createElement('a');
                                link.href = story['url'];
                                link.innerText = story['title'];
                                listItem.appendChild(link);
                                storyDiv.appendChild(listItem);
                            }
                        }
                    });
                };
            })(i);
            https.request(options, callback).end();
        };
    });
}

https.request(options, callback).end();

// var server = http.createServer(function(req, res) {
//     res.writeHead(200);
//     res.end('Hello Http');
// });
// server.listen(8080);