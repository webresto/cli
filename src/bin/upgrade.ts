import { exec, config } from 'async-shelljs';
import chalk from 'chalk';
export const upgrade = async () => {
    config.silent = false;
    console.log(
      chalk`{blueBright.bold It just hard reinstall webresto/cli}`
  );
    console.log(
        chalk`{rgb(10, 0, 0).bgYellow.bold TODO:} need check updates in NPMJS \n---`
    );
    await exec(
        `npm uninstall -g @webresto/cli && npm install -g @webresto/cli`
    );
};
