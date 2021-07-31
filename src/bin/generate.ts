import fs from 'fs'; 
import {exec, config} from 'async-shelljs';
config.silent = true; 
export const generate = async (what: any, name: any) => {

    let modulesPath = process.cwd()+ "/modules/"
    if (! fs.existsSync(modulesPath)) throw `Dirrectory ${modulesPath} not found`

    let currentModulePath = process.cwd()+ "/modules/" + name
    if (fs.existsSync(currentModulePath)) throw `Dirrectory ${currentModulePath} was found`

    switch (what) {
      case "module":
          let gitExist: boolean = await exec("git --version").code === 0  ? true : false; 
          if (gitExist) {
            await exec(`git clone https://github.com/webresto/module-starter.git ${currentModulePath}`)
            await exec(`${currentModulePath}/utils/module_init`)
          } else {
            // await exec(`wget https://github.com/webresto/module-starter/archive/refs/heads/main.zip -O ${currentModulePathTMP} ..... `)
            console.log("git is not exist")
          }
          
        break;
    
      default:
           throw `Generate ${what} not known`
        break;
    }
    console.log(process.cwd(), what, name);
};
