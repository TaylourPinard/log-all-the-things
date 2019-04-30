const fs = require('fs');
const express = require('express');
const app = express();

function format(req, res){
    var newDate = new Date();
    var datetime = newDate.toISOString();
    var statusCode = res.statusCode;
    if(statusCode === undefined || statusCode === null) statusCode = 200;
    return `\n${req.headers['user-agent']},${datetime},${req.method},${req.url},HTTP/${req.httpVersion},${statusCode}`;
}

app.use((req, res, next) => {
// write your logging code here
    console.log(format(req, res));
    fs.appendFile('server/log.csv', format(req, res), function(err){
        if(err) throw err;
    });
    next();
});

app.get('/', (req, res) => {
    res.status(200).send("OK");
});

app.get('/logs', (req, res) => {
    csv = fs.readFileSync('server/log.csv').toString();
    var lines = csv.split('\n');
    var headers = lines[0].split(',');
    var objects = [];
    for(let i = 1; i < lines.length; i++){
        var obj = {};
        var currentLine = lines[i].split(',');
        for(let x = 0; x < headers.length; x++){
            obj[headers[x]] = currentLine[x];
        }
        objects.push(obj);
    }
    res.send(objects).status(200);
});

module.exports = app;