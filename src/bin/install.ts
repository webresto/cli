import fs from 'fs';
import { exec, config } from 'async-shelljs';
export const install = async (module: any) => {
    if (module) {
        // if (debug) {
        config.silent = false;
        // } else {
        //     config.silent = true;
        // }

        let modulesPath = process.cwd() + '/modules/';
        if (!fs.existsSync(modulesPath))
            throw `Dirrectory ${modulesPath} not found`;

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
            `curl https://registry.webresto.dev/${module}/${module}.tar  | tar -xv -C ${currentModulePath}`
        );

        console.log(process.cwd(), module);
    } else {
        const modulesList = (fs.readFileSync(`${process.cwd()}/webresto-modules.list`, {encoding:'utf8', flag:'r'})).split('\n');

        for await (let module of modulesList) {
            if(!module) continue;

            let currentModulePath = process.cwd() + '/modules/' + module;

            if (fs.existsSync(currentModulePath)) {
                console.log("DIRECTORY EXIST " + currentModulePath)
                continue
            }

            await exec(`  mkdir -p ${currentModulePath}`);

            if ((await exec('curl --version').code) !== 0) {
                throw 'curl not found';
            }

            if ((await exec('tar --version').code) !== 0) {
                throw 'tar not found';
            }

            await exec(
                ` curl https://registry.webresto.dev/${module}/${module}.tar  | tar -xv -C ${currentModulePath} && cd ${currentModulePath} && npm install --only=prod`
            );
        }
    }
};
