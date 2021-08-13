import fs from 'fs';
import { exec, config } from 'async-shelljs';
export const publish = async (module: any) => {
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

    if ((await exec('curl --version').code) !== 0) {
        throw "curl not found"
    }
    
    await exec(
        `cd ./module/${module} && tar -cf - . | curl -vX POST -F module=@- -F name=123 https://registry.webresto.dev/upload`
    );

    console.log(process.cwd(),module);
};
