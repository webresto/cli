#!/usr/bin/env node
import * as packgeJSON from '../../package.json';
import commander from 'commander';
import { placeOrder } from '../waiter';
import { writeFile } from '../file-access';
import { generate } from "./generate"
import { upgrade } from "./upgrade"
import { update } from "./update"
import { install } from "./install"
import { publish } from "./publish"


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
    .command('install [module]')
    .description('install module')
    .option('-d, --debug', 'Output additional debugging info')
    .action(async (module) => {
        // console.log('generate here');
        install(module)
    });

program
    .command('publish [module]')
    .description('publish module')
    .option('-d, --debug', 'Output additional debugging info')
    .option('-p, --postfix <branch_name>', 'optional postfix to module name ![works only publish from module dir]')
    .action(async (module) => {
        // console.log('generate here')
        program.parse(process.argv);
        const options = program.opts();
        publish(module, options)
    });

program
    .command('update [module]')
    .description('update module')
    .option('-d, --debug', 'Output additional debugging info')
    .action(async (module) => {
        // console.log('generate here');
        update(module)
    });

program
    .command('upgrade')
    .description('Hard reinstall')
    .action(async () => {
        upgrade()
    });    

program.parse(process.argv);
