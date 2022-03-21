'use strict';

const url = require('url');
var http = require('http');
var https = require('https');

const readline = require('readline');
var currentLine = ""
export const repl = async (target: any, options?: any) => {
    if (!target) throw 'URL required';

    const opts = url.parse(target);
    opts.method = 'PUT';
    opts.headers = {
        Expect: '100-continue'
    };

    let protocol = new URL(target).protocol;
    let client = protocol == 'https:' ? https : http;

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
        output: process.stdout,
        terminal:true
    });

    rl.on('line', input => {
        currentLine = ""
        req.write(input);
        req.write('\n');
    });

    rl.on('close', () => {
        process.exit(0);
    });

    /**
     * I want to release option to send special code like @tab${command}
     * for ask REPL-server to autocomplete
     * 
     * //TODO:  currently need exception for left and rigth arrow (move cursor)
     */
    process.stdin.on('keypress', (chunk, key) => {
        if (key.name === 'tab') {
            // console.log("tab")
            console.log(`@tab${currentLine}`)
            //req.write(`@tab${currentLine}`);
            
        } else if(key.name=== 'backspace') {
            currentLine = currentLine.slice(0, -1) 
        } else if(key.name === 'left'){
            currentLine += key.name
        } else if(key.name.length === 1){
            currentLine += key.name
        }
        // console.log(key.name)
    });
};
