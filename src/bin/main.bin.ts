#!/usr/bin/env node
import * as packgeJSON from '../../package.json';
import commander from 'commander';
import { placeOrder } from '../waiter';
import { writeFile } from '../file-access';
import { generate } from "./generate"
import { upgrade } from "./upgrade"

const program = new commander.Command();

program.version(packgeJSON.version);

program
    .command('generate [what] [name]')
    .description('Generate new ecosystem object')
    .option('-d, --debug', 'Output additional debugging info')
    //   .requiredOption(
    //     '-da, --demoAccount <string>',
    //     'The demo account that should be cleaned or populated. See settings.ts for valid demo accounts.'
    //   )
    .action(async (what, name) => {
        // console.log('generate here');
        generate(what, name)
    });



program
    .command('upgrade')
    .description('Hard reinstall')
    .action(async () => {
        upgrade()
    });    

program.parse(process.argv);
