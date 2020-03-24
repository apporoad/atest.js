#!/usr/bin/env node

const program = require('commander')


program.version(require('../package.json').version)
    .usage('atest  path')
    .option('-v --verbose','print details', /^(true|false)$/i, "true")
    .parse(process.argv)


var  workplace = program.args.length>0 ?  program.args[0] : '.'

//todo 