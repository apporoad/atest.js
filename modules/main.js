// here main of atest

const fs = require('fs')
const path = require('path')

const instanceMan = require('./instanceMan')
const contextMan = require('./contextMan')
const utils = require('lisa.utils')

/**
 * run atest
 */
exports.atest = async (testingInstances,allInstances)=>{
    //1.  get pre instances
    var orderedInstances = await instanceMan.getOrderedInstances(testingInstances,allInstances,contextMan.getAvailableContext())
    
    //contextMan.getOrderedInstances
}

const existsAtest = (dir) =>{
    var pt = path.join(dir,'atest.js')
    if(fs.existsSync(pt)){
        if(fs.statSync(pt).isFile())
            return true
    }
    pt = path.join(dir,'atest.json')
    if(fs.existsSync(pt)){
        if(fs.statSync(pt).isFile())
            return true
    }
    return false
}

exports.findAtestRootPath = (currentPath)=>{
    var dir1 = path.dirname(currentPath)
    var dir2 = path.dirname(dir1)
    var dir3 = path.dirname(dir2)
    if(existsAtest(dir3)){
        if(dir3 == dir2){
            return dir3
        }else 
        {
            return exports.findAtestRootPath(dir3)
        }
    }
    if(existsAtest(dir2)){
        return exports.findAtestRootPath(dir2)
    }
    if(existsAtest(dir1)){
        return exports.findAtestRootPath(dir1)
    }
    return currentPath
}

var existsFile = p =>{
    return fs.existsSync(p) && fs.statSync(p).isFile()
}
exports.loadCurrentInstance = async currentPath =>{
    var meta = null
    var instance = {}
    var pJson =path.join(currentPath,'atest.json')
    var pJs = path.join(currentPath,'atest.js')
    //加载meta
    if(existsFile(pJson)){
        meta = require(pJson)
    }else if(existsFile(pJs)){
        meta = require(pJs)
        if(utils.Type.isFunction(meta)){
            meta = await meta()
        }else
        {
            meta = await Promise.resolve(meta)
        }
    }
    //加载req
    //req req.json req.js request request.json request.js  
    var req = path.join(currentPath,'req')
    var reqJson = path.join(currentPath,'req.json')
    var reqJs = path.join(currentPath,'req.js')
    var request = path.join(currentPath,'request')
    var requestJson = path.join(currentPath,'request.json')
    var requestJs = path.join(currentPath,'request.js')
    if(existsFile(req)){
        //todo
    }
}

exports.loadInstances = (currentPath) =>{
    // get atest root
    var atestRoot = exports.findAtestRootPath(currentPath)
    

}