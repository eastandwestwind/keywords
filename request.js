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
        for (var i = 0; i < 10 && i < json.length; i++) {
            var post = json[i];
            console.log(json[i]);
            var options = {
                host: 'hacker-news.firebaseio.com',
                path: '/v0/item/' + json[i] + '/title.json'
            };
            callback = function(response) {
                var titles = '';
                //another chunk of data has been recieved, so append it to `str`
                response.on('data', function (chunk) {
                    titles += chunk;
                    exports.titles += chunk;
                });
                response.on('end', function () {
                    console.log(titles);
                    var storyDiv = document.getElementById("stories");
                    var listItem = document.createElement('li');
                    listItem.appendChild(document.createTextNode(titles));
                    storyDiv.appendChild(listItem);
                });
            };
            https.request(options, callback).end();
        };
    });
}

https.request(options, callback).end();

