'use strict';
const https = require('https');
const url = require('url');

const slackUrl = url.parse(process.env.SLACKURL);
slackUrl.method = 'POST';
slackUrl.headers = { 'Content-Type': 'application/json' };

module.exports = (title, message) => new Promise((resolve, reject) => {
    if (!message) reject(400);

    const req = https.request(slackUrl, function (res) {
        resolve(res.statusCode);
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        reject(500);
    });
    req.write(JSON.stringify({
        attachments: [
            {
                color: "good",
                fields: [
                    {
                        title: title,
                        value: message
                    }
                ]
            }
        ]
    }));
    req.end();
});
