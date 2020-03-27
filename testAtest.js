var atest = require('./modules/main')
var path = require('path')

it = (title , fn) =>{
    if(fn)
      fn()
  }
expect = ()=>{
return {
    toBe : ()=>{}
    }
}

require('./modules/atestUtil.test')
//atest.atestOnePath(__dirname + '/demo/login.api')