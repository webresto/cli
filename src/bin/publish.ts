import fs from 'fs';
import { exec, config } from 'async-shelljs';
export const publish = async (module: any, options?: any) => {
    // if (debug) {
    config.silent = false;
    // } else {
    //     config.silent = true;
    // }
    if (module) {
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
            ` cd ./modules/${module} && tar --exclude='./.git' -cvf - . | curl -vX POST -F module=@- -F name=${module} https://registry.webresto.dev/upload --insecure`
        );
    } else {
        if (!fs.existsSync(process.cwd()+"/package.json"))
            throw `in not package`;
        
        let package_json = require(process.cwd()+"/package.json");
        module = package_json.name.split('/').pop();
        if (options.postfix) module += `_${options.postfix}`;
        

        let path = process.cwd();
        await exec(`cd ${path} && tar --exclude='./.git' -cvf - .  | curl -vX POST -F module=@- -F name=${module} https://registry.webresto.dev/upload --insecure`);
    }
    

    console.log(process.cwd(),module);
};
