var spawn = require('child_process').spawn;

let proc = spawn(`git pull`);

proc.stdout.on('data', function (data) { 
    console.log(111);
    return 0
})
