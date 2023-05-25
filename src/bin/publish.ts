import fs from 'fs';
import { exec, config } from 'async-shelljs';

import publishMethod from 'module-registry-client-lib/lib/publish';

export const publish = async (module: any, options?: any) => {
    // if (debug) {
    config.silent = false;
    // } else {
    //     config.silent = true;
    // }

    let currentModulePath = '';
    if (module) {
        currentModulePath = process.cwd() + '/modules/' + module;
    } else {
        if (!fs.existsSync(process.cwd() + '/package.json'))
            throw `in not package`;
        currentModulePath = process.cwd();
    }

    let userToken = process.env.WEBRESTO_REGISTRY_TOKEN;
    await publishMethod(currentModulePath, userToken, 'main', 'test note');
};
