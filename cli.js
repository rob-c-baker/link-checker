#!/usr/bin/env node

import main from "./dist/main.js";

// to debug EventEmitter potential memory leak
process.on('warning', e => console.warn(e.stack));

// get the arguments
const [,, ...args] = process.argv;
if (args.length === 0) {
    console.error('You must supply a starting URL.');
}

const start_url = args[0];

// run the script
main(start_url);