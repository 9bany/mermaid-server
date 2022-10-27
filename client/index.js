const express = require("express");
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const fs = require('fs');
const axios = require('axios');
const port = 3000

const app = express()

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

function readModuleFile(path, callback) {
    try {
        var filename = require.resolve(path);
        fs.readFile(filename, 'utf8', callback);
    } catch (e) {
        callback(e);
    }
}

app.use(connectLiveReload());

app.get('/', (req, res) => {
    readModuleFile('./words.txt', function (err, data) {

        var config = {
            method: 'post',
            url: 'http://localhost:80/generate',
            headers: {
                'Content-Type': 'text/plain'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                res.send(response.data)
            })
            .catch(function (error) {
                res.send(error);
            });


    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})