var needle = require('needle')
var utils = require('lisa.utils')
var path = require('path')



exports.req = (method,url,data,options)=>{
    return needle(method,url,data,options)
}


exports.checkInstance = instance =>{
    // check url
}


exports.invokeInstance = async (instance, context,options) =>{
        if(!exports.checkInstance(instance)){
            //todo
            return 
        }
        var method = instance.realMeta. method || 'get'
        var url  = utils.startWith(instance.realMeta.url,'http') ? instance.realMeta.url  :  path.join(instance.realMeta.baseUrl , instance.realMeta.url)

        return result = await exports.req(method,url, instance.realReq,options)    
}