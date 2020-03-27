var needle = require('needle')
var utils = require('lisa.utils')



exports.req = (method,url,data,options)=>{
    return needle(method,url,data,options)
}


exports.checkInstance = instance =>{
    // check url
    return true
}


exports.invokeInstance = async (instance, context,options) =>{
        if(!exports.checkInstance(instance)){
            //todo
            return 
        }
        var method = instance.realMeta. method || 'get'
        var url  = utils.startWith(instance.realMeta.url,'http') ? instance.realMeta.url  :  utils.endTrim(instance.realMeta.baseUrl,'/' ) +'/'  + utils.startTrim(instance.realMeta.url,'/')
        try{
            //todo
            var result = await exports.req(method,url, instance.realReq.data,options)    
        }catch(e){
            //console.log(e)
        }
        //console.log(result)
        return result ? result.body : null
}