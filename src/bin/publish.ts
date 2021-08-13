import fs from 'fs';
import { exec, config } from 'async-shelljs';
export const publish = async (module: any) => {
    // if (debug) {
    config.silent = false;
    // } else {
    //     config.silent = true;
    // }

    let currentModulePath = process.cwd() + '/modules/' + module;
    if (!fs.existsSync(currentModulePath))
        throw `Dirrectory ${currentModulePath} not found`;

    if ((await exec('curl --version').code) !== 0) {
        throw "curl not found"
    }
    
    if ((await exec('tar --version').code) !== 0) {
        throw "tar not found"
    }
    

    await exec(
        `set -x; cd ./modules/${module} && tar -czvf - . | curl -vX POST -F module=@- -F name=${module} https://registry.webresto.dev/upload`
    );

    console.log(process.cwd(),module);
};
