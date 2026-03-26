const chalk= require('chalk');


function info(message){
    console.log(chalk.blue(message));
}

function success(message){
    console.log(chalk.green(`✅ ${message}`));
}

function error(message){
    console.log(chalk.red(`❌ ${message}`));
}

function warn(message){
    console.log(chalk.yellow(`⚠️ ${message}`));
}


module.exports={
    info,
    success,
    error,
    warn
}