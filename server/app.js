const express = require('express');
const fs = require('fs');
const app = express();
var allDataLogs = [];

app.use((req, res, next) => {
    // write your logging code here
    var timeStamp = new Date();
    var logData = '';
    //push agent as first element of array
    logData += req.headers['user-agent'].replace(',', '') + ',';

    //push timestamp into second element of array
    logData += (new Date()).toISOString() + ',';
    logData += req.method + ',';
    logData += req.originalUrl + ',';
    logData += 'HTTP/' + req.httpVersion + ',';
    logData += res.statusCode + '\n';

    // allDataLogs.push(logObject);
    console.log(logData.toString());

    fs.appendFile('log.csv', logData, (err) => {
        if (err) throw err;
    });
    next();
});

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    res.send("ok, request received");
});

app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    var data = fs.readFile('log.csv', 'utf8', function (err, data) {
        if (err) throw err;
        var aLines = data.split('\n');
        var jsonObj = [];
        for (var i = 1; i < aLines.length; i++) { 
            if (aLines[i].length < 3) break;
            var aKeys = aLines[i].split(',');

            var obj = {
                "Agent":     aKeys[0],
                "Time":      aKeys[1],
                "Method":    aKeys[2],
                "Resource":  aKeys[3],
                "Version":   aKeys[4],
                "Status":    aKeys[5]
            }
            //do something with the data
            /*
            [
                {
                    "Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                    "Time": "2017-06-26T22:39:51.400Z",
                    "Method": "GET",
                    "Resource": "/",
                    "Version": "HTTP/1.1"
                    "Status": "200"
                },
                ...
            ]
            */
            // jsonObj += '"Agent":"' + aKeys[0] + '",' +
            //     '"Agent":"' + aKeys[0] + '",' +
            //     '"Time":"' + aKeys[1] + '",' +
            //     '"Method":"' + aKeys[2] + '",' +
            //     '"Resource":"' + aKeys[3] + '",';
            //     '"Version":"' + aKeys[4] + '",' +
            //     '"Resource":"' + aKeys[5] + '"}';

            // if (i < aLines.length - 1) {
            //     jsonObj += ',';
            // }

            jsonObj.push(obj);
        }
        res.json(jsonObj);
        // return data;
    });
    //res.send(data);
});

module.exports = app;
