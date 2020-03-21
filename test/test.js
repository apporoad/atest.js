
const find = require('find')
const utils = require('lisa.utils')
var path = require('path')
var fs = require('fs')
//console.log(path.dirname('/abc/def/efg/hij/klm/opq'))

//console.log(path.dirname(path.dirname('/abc')))

//console.log(path.dirname('D:/abc'))

var xx = async ()=>{
    return await new Promise(r=>r(1))
}

//xx().then(d=>{console.log(d)})


//console.log(find.fileSync(/req\.js$/,path.dirname(__dirname) + '/demo/1.api'))


//console.log(fs.existsSync(path.join(__dirname,'/asdf/asdf/.atest')))


console.log(utils.Type.isFunction(()=>{}))
console.log(utils.Type.isAsyncFunction(async ()=>{}))


//utils.Type.isAsyncFunction
