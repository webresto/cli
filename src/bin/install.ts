import fs from 'fs';
import { exec, config } from 'async-shelljs';
import downloadMethod from 'module-registry-client-lib/lib/download';

export const install = async (module: any) => {
    let modulesPath = process.cwd() + '/modules/';
    if (module) {
        // if (debug) {
        config.silent = false;
        // } else {
        //     config.silent = true;
        // }

        if (!fs.existsSync(modulesPath))
            throw `Dirrectory ${modulesPath} not found`;

        let currentModulePath = process.cwd() + '/modules/' + module;
        if (fs.existsSync(currentModulePath)) {
            throw `Module path exist ${currentModulePath}`;
        }

        await downloadMethod(
            module,
            'latest',
            process.env.WEBRESTO_LICENSE,
            modulesPath
        );
    } else {
        let webrestoListFile = `${process.cwd()}/webresto-modules.list`;
        if (fs.existsSync(webrestoListFile)) {
            const modulesList = fs
                .readFileSync(`${process.cwd()}/webresto-modules.list`, {
                    encoding: 'utf8',
                    flag: 'r'
                })
                .split('\n');
            for await (let module of modulesList) {
                if (!module) continue;

                let version = 'latest';
                const moduleAndVersion = module.split('@');
                if (moduleAndVersion.length === 2) {
                    module = moduleAndVersion[0];
                    version = moduleAndVersion[1];
                }

                let currentModulePath = process.cwd() + '/modules/' + module;

                if (fs.existsSync(currentModulePath)) {
                    console.info('DIRECTORY EXIST ' + currentModulePath);
                    continue;
                }

                await downloadMethod(
                    module,
                    version,
                    process.env.WEBRESTO_LICENSE,
                    modulesPath
                );
            }
        }
    }
};
