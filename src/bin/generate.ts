import fs from 'fs';
import { exec, config } from 'async-shelljs';
export const generate = async (what: any, name: any) => {
    // if (debug) {
    config.silent = false;
    // } else {
    //     config.silent = true;
    // }

    let modulesPath = process.cwd() + '/modules/';
    if (!fs.existsSync(modulesPath))
        throw `Dirrectory ${modulesPath} not found`;

    let currentModulePath = process.cwd() + '/modules/' + name;
    if (fs.existsSync(currentModulePath))
        throw `Dirrectory ${currentModulePath} was found`;

    switch (what) {
        case 'module':
            let gitExist: boolean =
                (await exec('git --version').code) === 0 ? true : false;
            if (gitExist) {
                await exec(
                    `git clone https://github.com/webresto/module-starter.git ${currentModulePath}`
                );

                await exec(`rm -rf  ${currentModulePath}/.git`);
            } else {
                // await exec(`wget https://github.com/webresto/module-starter/archive/refs/heads/main.zip -O ${currentModulePathTMP} ..... `)
                console.log('git is not exist');
            }
            await exec(
                `cd ${currentModulePath}/.factory && npm i && cd ${currentModulePath} && .factory/module_init ${name} && npm i`
            );

            break;

        default:
            throw `Generate ${what} not known`;
            break;
    }
    console.log(process.cwd(), what, name);
};
