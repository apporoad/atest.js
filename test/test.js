
const find = require('find')

var path = require('path')
console.log(path.dirname('/abc/def/efg/hij/klm/opq'))

console.log(path.dirname(path.dirname('/abc')))

console.log(path.dirname('D:/abc'))

var xx = async ()=>{
    return await new Promise(r=>r(1))
}

xx().then(d=>{console.log(d)})


console.log(find.fileSync(/req\.js$/,path.dirname(__dirname) + '/demo/1.api'))