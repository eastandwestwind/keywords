exports.requestPunctuatedText = function(callArray, keywordArray, onPunctuationComplete) {
    "use strict";
    var request = require('request');

    function donePunctuating() {
        console.log('all done');
        console.log(punctuatedArray);
        onPunctuationComplete(punctuatedArray);
    }

    var itemsProcessed = 0;
    var punctuatedArray = [];
    var sentencesWithKeywordsArray = [];

    callArray.forEach(function(item, index, array){
        // Configure the request
        var options = {
            url: 'http://bark.phon.ioc.ee/punctuator',
            method: 'POST',
            form: {'text': item}
        };

        // Set the headers and options ...
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                punctuatedArray.push(body);
                itemsProcessed++;
                if(itemsProcessed === array.length) {
                    donePunctuating();
                }
            }
        });
    });
};