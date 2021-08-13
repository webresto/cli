import fs from 'fs';
import { exec, config } from 'async-shelljs';
export const install = async (module: any) => {
    // if (debug) {
    config.silent = false;
    // } else {
    //     config.silent = true;
    // }

    let modulesPath = process.cwd() + '/modules/';
    if (!fs.existsSync(modulesPath))
        throw `Dirrectory ${modulesPath} not found`;

    let currentModulePath = process.cwd() + '/modules/' + module;
    if (fs.existsSync(currentModulePath))
        throw `Dirrectory ${currentModulePath} was found`;

    if ((await exec('wget --version').code) !== 0) {
        throw "wget not found"
    }

    if ((await exec('tar --version').code) !== 0) {
        throw "tar not found"
    }


    await exec(
        `wget -qO- https://registry.webresto.dev/${module}/${module}.tar.gz | tar xvz - -C ${currentModulePath}`
    );


    console.log(process.cwd(), module);
};
