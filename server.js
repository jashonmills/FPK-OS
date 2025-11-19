const http = require('http'); 
const https = require('https');
const url = require('url');

const API_ENDPOINT = 'https://57y3bjg772.execute-api.us-east-2.amazonaws.com/orchestrate';

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {

            const options = url.parse(API_ENDPOINT);
            options.method = 'POST';
            options.headers = {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            };

            const proxyReq = https.request(options, (proxyRes) => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res);
            });

            proxyReq.on('error', (err) => {
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
            });

            proxyReq.write(body);
            proxyReq.end();
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(3000, () => console.log('Proxy server running on http://localhost:3000'));
