#!/usr/bin/env zx
import { $, chalk, fs } from 'zx';
import { JSDOM } from 'jsdom';
import CleanCSS from 'clean-css';

// show command outputs
$.verbose = true;

// some useful variables
const version = JSON.parse(fs.readFileSync('./package.json')).version;
var isWin     = process.platform === "win32";

// if on windows, force zx to use cmd.exe (otherwise it will use wsl)
if(isWin) {
    if(!process.env.USE_WSL) {
        console.log(chalk.yellow("[!] Windows detected, using cmd.exe instead of wsl. If you would prefer to use WSL, please run this script with USE_WSL=1"));

        $.prefix = ''; // https://github.com/google/zx/issues/398
        $.shell  = `C:\\WINDOWS\\system32\\cmd.exe`;
    } else {
        console.log(chalk.yellow(`[!] Windows platform, but using WSL. If you would prefer to use cmd.exe, please run this script with USE_WSL=0`));

        isWin = false;
        // zx will automatically use wsl
        // so no need to set $.prefix and $.shell
    }
} else {
    console.log(chalk.yellow(`[!] Platform: ${process.platform} (not windows)`));
}

// build the typescript project with tsc
console.log(chalk.green(`» Building Typescript project...`));
await $`tsc`;

// copy the template file to the dist folder
console.log(chalk.green(`» Copying template file...`));
if(isWin) await $`copy src\\template.html dist\\template.html`; // windows uses copy instead of cp
else await $`cp ./src/template.html ./dist/template.html`; // mac/linux uses cp

// extract the <style> tag from the template file
console.log(chalk.green(`» Extracting template css...`));
const template = fs.readFileSync('./dist/template.html', 'utf8');
const dom      = new JSDOM(template);
const style    = dom.window.document.querySelector('style').innerHTML;
const minified = new CleanCSS().minify(style);

if(minified.errors?.length) console.warn(chalk.yellow(`[!] CSS errors: ${minified.errors.join(', ')}`));
fs.writeFileSync('./dist/template.css', minified.styles);

// Create releases
console.log(chalk.green(`» Creating release...`));
await $`npm pack`;

// thats it for now!
console.log(chalk.green(`» Done!`));