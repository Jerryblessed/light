// pages/api/stream.js
import request from 'request';

export default function handler(req, res) {
    var options = {
        method: 'POST',
        url: 'https://api.thetavideoapi.com/stream',
        headers: {
            'x-tva-sa-id': 'srvacc_5qsp988etr3giht8h9kuew9ju',
            'x-tva-sa-secret': 'kuwsyq0cx2gipaggec1ba2pumzat80qj',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'demo' })
    };

    request(options, function (error, response, body) {
        if (error) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
        res.status(200).json({ status: 'success', body: JSON.parse(body) });
    });
}
