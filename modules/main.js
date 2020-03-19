// here main of atest

const fs = require('fs')
const path = require('path')
const find = require('find')

const instanceMan = require('./instanceMan')
const contextMan = require('./contextMan')
const utils = require('lisa.utils')

/**
 * run atest
 */
exports.atest = async (testingInstances,allInstances)=>{

    // todo
    //1.  get pre instances
    var orderedInstances = await instanceMan.getOrderedInstances(testingInstances,allInstances,contextMan.getAvailableContext())
    
    //contextMan.getOrderedInstances
}

/**
 * run test @  one path
 */
exports.atestOnePath = ()=>{
    //todo
}

exports.atestAllOneDir = rootDir =>{
    //todo
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

var getId = p =>{
    return p.replace(/[\\\/:]/g,'_')
}

//获取单个raw实例
exports.loadCurrentRawInstance = currentPath =>{
    var instance = {}
    instance.id = getId(currentPath)
    instance.src = currentPath
    var pJson =path.join(currentPath,'atest.json')
    var pJs = path.join(currentPath,'atest.js')
    //加载meta
    if(existsFile(pJson) ){
        instance.meta = require(pJson)
    }else if(existsFile(pJs)){
        instance.meta = require(pJs)
    }
    //加载req
    //req req.json req.js request request.json request.js  
    var reqJson = path.join(currentPath,'req.json')
    var reqJs = path.join(currentPath,'req.js')
    var requestJson = path.join(currentPath,'request.json')
    var requestJs = path.join(currentPath,'request.js')
    var req = path.join(currentPath,'req')
    var request = path.join(currentPath,'request')
    if(existsFile(reqJson)){
        instance.req = require(reqJson)
    }else if (existsFile(reqJs)){
        instance.req =require(reqJs)
    } else if (existsFile(requestJson)){
        instance.req = require(requestJson)
    } else if (existsFile(requestJs)){
        instance.req = require(requestJs)
    }else if ( existsFile(req)){
        instance.req = fs.readFileSync(req,"utf8")
    } else if (existsFile(request)){
        instance.req = fs.readFileSync(request,'utf8')
    }else{
        instance.req = null
    }
    // 加载 res
    //res.json res.js response.json response.js res response
    var resJson = path.join(currentPath,"res.json")
    var resJs = path.join(currentPath,"res.js")
    var responseJson = path.join(currentPath,'response.json')
    var responseJs = path.join(currentPath,'response.js')
    var res = path.join(currentPath,"res")
    var response = path.join(currentPath,'response')
    if(existsFile(resJson)){
        instance.res = require(resJson)
    }else if( existsFile(resJs)){
        instance.res=  require(resJs)
    }else if (existsFile(responseJson)){
        instance.res= require(responseJson)
    }else if( existsFile(responseJs)){
        instance.res= require(responseJs)
    }else if(existsFile(res)){
        instance.res = fs.readFileSync(res,'utf8')
    }else if(existsFile(response)){
        instance.res= fs.readFileSync(response,'utf8')
    }else{

    }
    if(!instance.meta && !instance.req){
        return null
    }
    return instance
}

//获取当前目录以下所有raw实例
exports.loadAllRawInstancesUnderRoot=  rootPath =>{
    var dirs = find.dirSync(rootPath)
    var array = []
    dirs.forEach(dir =>{
        array.push(new Promise(r=>{
            r(exports.loadCurrentRawInstance(dir))
        }))
    })
    return Promise.all(array)
}

//获取当前项目下所有raw实例
exports.loadRawInstances = async (currentPath) =>{
    // get atest root
    var atestRoot = exports.findAtestRootPath(currentPath)
    // get currentRawInstance
    var currentRawInstance = exports.loadCurrentRawInstance(currentPath)
    // get all raw instances
    var allRawInstances = await exports.loadAllRawInstancesUnderRoot(atestRoot)
    var temp = []
     allRawInstances.forEach(i =>{
         if(i)
         temp.push(i)
     })
     allRawInstances = temp
     
     return {
         atestRoot : atestRoot,
         currentInstance :  currentRawInstance,
        allRawInstances : allRawInstances
     }
}