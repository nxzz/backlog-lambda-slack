'use strict';
/*
The MIT License (MIT)

Copyright 2019 Rimpei Kunimoto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

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
