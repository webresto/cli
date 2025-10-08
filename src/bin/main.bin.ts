#!/usr/bin/env node
import * as packgeJSON from '../../package.json';
import commander from 'commander';
import { placeOrder } from '../waiter';
import { writeFile } from '../file-access';
import { generate } from './generate';
import { upgrade } from './upgrade';
import { update } from './update';
import { install } from './install';
import { publish } from './publish';
import { repl } from './repl';

const program = new commander.Command();

program.version(packgeJSON.version);

import { rcFile } from 'rc-config-loader';

interface Config {
    registry?: string;
    license?: string;
    registry_token?: string;
}

let config: Config;
try {
    config = (rcFile('webresto') as unknown) as Config;
} catch (error) {
    console.error(`.webrestorc not found`);
}

if (!config) config = {};

process.env.WEBRESTO_REGISTRY =
    process.env.WEBRESTO_REGISTRY ??
    config.registry ?? 'https://marketplace.restoapp.org/' ??
    'https://registry.webresto.org/';

process.env.MODULE_STORAGE_URL = process.env.WEBRESTO_REGISTRY;
process.env.WEBRESTO_LICENSE = process.env.WEBRESTO_LICENSE ?? config.license;

process.env.WEBRESTO_REGISTRY_TOKEN =
    process.env.WEBRESTO_REGISTRY_TOKEN ?? config.registry_token ?? '';

program.parse(process.argv);
const options = program.opts();

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
        generate(what, name);
    });

program
    .command('install [module]')
    .description('install module')
    .option('-d, --debug', 'Output additional debugging info')
    .option(
        '-c, --channel <channel_name>',
        'channel for donwload'
    )
    .action(async (module: any, options: any) => {
        install(module, options);
    });

program
    .command('publish [module]')
    .description('publish module')
    .option('-d, --debug', 'Output additional debugging info')
    .option(
        '-t, --tag <tag_name>',
        'optional tag to module'
    )
    .action(async (module: any, options: any) => {
        publish(module, options);
    })
    .parse(process.argv);

program
    .command('update [module]')
    .description('update module')
    .option('-d, --debug', 'Output additional debugging info')
    .action(async module => {
        // console.log('generate here');
        update(module);
    });

program
    .command('repl [url]')
    .description('connect to repl-server')
    .option('-d, --debug', 'Output additional debugging info')
    .action(async url => {
        // console.log('generate here');
        repl(url);
    });

program
    .command('upgrade')
    .description('Hard reinstall')
    .action(async () => {
        upgrade();
    });

program.parse(process.argv);
