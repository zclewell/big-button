const fs = require('fs');
const http = require('http');
const ks = require('node-key-sender');
const { parse } = require('querystring');

let obj = null;
try {
  obj = JSON.parse(fs.readFileSync('my.config'));
} catch {
  console.log('could not finding config file, using defaults...');
}

const passKey = (obj && 'pass_key' in obj) ? obj['pass_key'] : 'thisIsSecret';
const port = (obj && 'port' in obj) ? obj['port'] : 8080;

const action = () => {
  ks.sendCombination(['alt', 'f4']);
}

const requestListener = function (req, res) {
  res.writeHead(200);
  if (req.method === 'POST') {
    console.log('Got a POST request...');

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
      parsed = parse(body);
      if ('pass_key' in parsed && parsed['pass_key'] === passKey) {
        console.log('\trecieved valid pass_key');
        action();
        res.end('pass_key accepted\n');
      } else {
        console.log('\trecieved invalid pass_key');
        res.end('pass_key missing or invalid\n');
      }
    });
  } else {
    console.log('Got non POST request, ignoring...');
    res.end('Ignoring non POST request\n');
  }
}

const server = http.createServer(requestListener);
server.listen(port);