var main =require('../modules/main')

var path = require('path')


//console.log( main.findAtestRootPath(path.dirname(__dirname) + '/demo/1.api/case001/'))


//console.log( main.findAtestRootPath(__dirname))


//console.log(main.loadCurrentInstance(path.dirname(__dirname) + '/demo/1.api'))

// main.loadInstances(path.dirname(__dirname) + '/demo/1.api').then(data=>{
//     console.log(data)
// })


console.log(main.getUpperMetas(  path.dirname(__dirname) + '/demo/1.api/case001/',  path.dirname(__dirname) + '/demo' ))