#!/usr/bin/env node

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const args = process.argv.slice(2);
const shellParam = args[0];

const isTTY = process.stdin.isTTY;
const stdin = process.stdin;
const stdout = process.stdout;

if (isTTY && args.length === 0) {
  console.log('Usage: ');
} else if (isTTY && args.length !== 0) {
  handleShellArguments();
} else {
  handleStdin();
}

function handleStdin() {
  let headersData = '';

  stdin.setEncoding('utf8');
  stdin.on('readable', () => {
    const chuck = stdin.read();
    if(chuck !== null){
      headersData += chuck;
    }
  });
  stdin.on('end', () => process.stdout.write(JSON.stringify(format(headersData))));
}


function format(data) {
  const lines = data.split(/\r?\n|\r/g);
  const result = {};
  lines.shift();
  for(let line of lines) {
    if(line.trim() === '') {
      continue;
    }
    const [key, value] = line.split(': ');
    result[key] = value.replace(/\\r/g, '');
  }
  return result;
}
 
async function handleShellArguments(){
  try {
    const input = await readFile(shellParam, { encoding: 'utf8' });
    process.stdout.write(JSON.stringify(format(input)))
  } catch (e) {
    console.log(`An error ocurred while trying to open the file: ${e.message}`);
  }
}