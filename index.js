#! /usr/bin/env node

const { spawn } = require('child_process')
const chalk = require('chalk');

var firstPart = 0;
var secondPart = 0;

var graderExec = "";
var graderArgs = [];
var solExec = "";
var solArgs = [];

process.argv.forEach(function (val, index, array) {
  if (val == "--") {
    if (firstPart == 0 && secondPart == 0) {
      firstPart = 1;
      secondPart = 0;
    } else {
      firstPart = 2;
      secondPart = 1;
    }
  } else {
    if (firstPart == 1 && secondPart == 0) {
      graderExec = val;
      firstPart = 2;
    } else if (firstPart == 2 && secondPart == 0) {
      graderArgs.push(val); 
    } else if (secondPart == 1) {
      solExec = val;
      secondPart = 2;
    } else if (secondPart == 2) {
      solArgs.push(val);
    }
  }
});

/*console.log(graderExec);
console.log(graderArgs);
console.log(solExec);
console.log(solArgs);*/

const grader = spawn(graderExec, graderArgs);
const sol = spawn(solExec, solArgs);

grader.stdout.on("data", (data)=> {
  console.log(chalk.blue("============== GRADER =============="));
  console.log(chalk.blue(data.toString().trim()));
  //console.log();
  sol.stdin.write(data.toString());
});

sol.stdout.on("data", (data)=> {
  console.log(chalk.green("============== SOLOUT =============="));
  console.log(chalk.green(data.toString().trim()));
  //console.log();
  grader.stdin.write(data.toString());
});

sol.stderr.on("data", (data)=> {
  console.log(chalk.red("============== SOLERR =============="));
  console.log(chalk.red(data.toString().trim()));
  //console.log();
  grader.stdin.write(data.toString());
});

grader.on("exit",(code)=> {
  console.log();
  var logchalk = chalk.red;
  if (code != 0) {
    logchalk = chalk.red;
  }
  
  console.log(logchalk("GRADER EXITED WITH CODE "+code));

  process.exit();
});

sol.on("exit",(code)=> {
  console.log();
  var logchalk = chalk.green;
  if (code != 0) {
    logchalk = chalk.red;
  }
  
  console.log(logchalk("SOL EXITED WITH CODE "+code));

  process.exit();
});

