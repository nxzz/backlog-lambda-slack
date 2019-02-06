'use strict';
const slack = require('./slack');
const backlog = require('./backlog');

exports.handler = function (event, context, callback) {
    const msg = backlog(JSON.parse(event.body));
    slack(msg.title, msg.value).then(status => {
        callback(null, {
            statusCode: status,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
    }).catch(error => {
        callback(null, {
            statusCode: error,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
    });
};
