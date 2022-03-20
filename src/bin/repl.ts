'use strict';

const url = require('url');
var http = require('http');
var https = require('https');

const readline = require('readline');

export const repl = async (target: any, options?: any) => {

    if (!target) throw "URL required"

    const opts = url.parse(target);
    opts.method = 'PUT';
    opts.headers = {
        Expect: '100-continue'
    };

    let protocol = (new URL(target)).protocol
    let client = (protocol == "https:") ? https : http

    const req = client.request(opts);

    opts.agent = new client.Agent({ keepAlive: true });
    
    req.on('response', res => {
        res.pipe(process.stdout);
        res.on('end', function() {
            process.exit(0);
        });
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', input => {
        req.write(input);
        req.write('\n');
    });

    rl.on('close', () => {
        process.exit(0);
    });
};
