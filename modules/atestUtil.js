const LJ = require('lustjson.js')
const reqFillSxg = require('./req.fillSxg')
const utils = require('lisa.utils')
const plugin = require('../plugins/default')


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
