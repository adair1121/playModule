var exec = require('child_process').exec;
var path = require('path');

exec(`cd ${__dirname}`)

console.log(process.cwd())

exec(`git pull`);

return  "0"
