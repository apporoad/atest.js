var main =require('../modules/main')

var path = require('path')


console.log( main.findAtestRootPath(path.dirname(__dirname) + '/demo/1.api/case001/'))


console.log( main.findAtestRootPath(__dirname))