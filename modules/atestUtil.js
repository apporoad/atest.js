const LJ = LustJson= require('lustjson.js')
const reqFillSxg = require('./req.fillSxg')
const utils = require('lisa.utils')
const plugin = require('../plugins/default')
const reqNeedsAndOutputsSxg = require('./req.needsAndOutputsSxg')
const resNeedsAndOutputsSxg = require('./res.needsAndOutputsSxg')


exports.fillReq =async (req, context)=>{
    if(req && context){
        if(utils.Type.isObject(req)){
            return await LJ.get(req, reqFillSxg, { context : context})
        }else if(utils.Type.isString(req)){
            return plugin.fillNeedsForString(req,context,null,null)
        }
    }
    return req
}

exports.getReqNeeds =  async (req)=>{
    if(!req) return []
    var tempOptions = {$:[], $out : []}
    var needs = null
    if(utils.Type.isObject(req)){
        await LustJson.get(req,reqNeedsAndOutputsSxg,tempOptions)
        needs = tempOptions.$
    }else if( utils.Type.isString(req)){
        needs = await plugin.getReqNeeds(req,tempOptions)
    }
    return needs
}


exports.getResNeeds =  async (res)=>{
    if(!res) return []
    var tempOptions = {$:[], $out : []}
    var needs = null
    if(utils.Type.isObject(res)){
        await LustJson.get(res,resNeedsAndOutputsSxg,tempOptions)
        needs = tempOptions.$
    }else if( utils.Type.isString(res)){
        needs = await plugin.getResNeeds(res,tempOptions)
    }
    return needs
}

exports.getResOutputs =  async (res)=>{
    if(!res) return []
    var tempOptions = {$:[], $out : []}
    var ops = null
    if(utils.Type.isObject(res)){
        await LustJson.get(res,resNeedsAndOutputsSxg,tempOptions)
        ops = tempOptions.$out
    }else if( utils.Type.isString(res)){
        ops = await plugin.getResOutputs(res,tempOptions)
    }
    return ops
}