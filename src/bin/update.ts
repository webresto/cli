import fs from 'fs';
const { readdirSync } = require('fs');
import { exec, config } from 'async-shelljs';
export const update = async (module: any) => {
    // if (debug) {
    config.silent = false;
    // } else {
    //     config.silent = true;
    // }

    let modulesPath = process.cwd() + '/modules/';
    if (!fs.existsSync(modulesPath))
        throw `Dirrectory ${modulesPath} not found`;


    if (module) {
        let currentModulePath = process.cwd() + '/modules/' + module;

        if (fs.existsSync(currentModulePath)) {
            await exec(
                `  mv ${currentModulePath} /tmp/${module}_${Date.now()}`
            );
        }

        await exec(`  mkdir -p ${currentModulePath}`);

        if ((await exec('curl --version').code) !== 0) {
            throw 'curl not found';
        }

        if ((await exec('tar --version').code) !== 0) {
            throw 'tar not found';
        }

        await exec(
            `curl ${process.env.MODULE_STORAGE_URL}/${module}/${module}.tar  | tar -xv -C ${currentModulePath}`
        );
    } else {
        const installedModules = readdirSync(modulesPath, {
            withFileTypes: true
        })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for await (let module of installedModules) {
            let currentModulePath = process.cwd() + '/modules/' + module;

            if (fs.existsSync(currentModulePath)) {
                await exec(
                    `  mv ${currentModulePath} /tmp/${module}_${Date.now()}`
                );
            }

            await exec(`  mkdir -p ${currentModulePath}`);

            if ((await exec('curl --version').code) !== 0) {
                throw 'curl not found';
            }

            if ((await exec('tar --version').code) !== 0) {
                throw 'tar not found';
            }

            await exec(
                ` curl ${process.env.MODULE_STORAGE_URL}/${module}/${module}.tar  | tar -xv -C ${currentModulePath} && cd ${currentModulePath} && npm install --only=prod`
            );
        }
    }

    console.log(process.cwd(), module);
};
