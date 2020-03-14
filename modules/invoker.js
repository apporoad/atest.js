var needle = require('needle')



exports.req = (method,url,data,options)=>{
    return needle(method,url,data,options)
}