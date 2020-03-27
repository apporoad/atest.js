// here main of atest

const fs = require('fs')
const path = require('path')
const find = require('find')
const locale = require('locale.node')

const instanceMan = require('./instanceMan')
const contextMan = require('./contextMan')
const utils = require('lisa.utils')
const invoker  = require('./invoker')
const atestUtils = require('./atestUtil')
const uicli = require('uicli.js')

/**
 * run atest
 */
exports.atest = async (testingInstances,allInstances,context,options)=>{

    //1.  get pre instances
    var orderedInstances = await instanceMan.getOrderedInstances(testingInstances,allInstances,  context ,options)
    
    // 2.  go run
    for(var index =0 ;index< orderedInstances.chain.length; index++){
        var instance = orderedInstances.chain[index]
        //translate first  转换掉内部函数
        await instanceMan.translateReq(instance,context,options)
        //feed meta
        instance.realMeta = await atestUtils.fillReq(instance.realMeta,context)
        //feed req
        instance.realReq = await atestUtils.fillReq(instance.realReq,context)
        // 解决没有满足的need
        //todo uicli
        //instance.realMeta =await uicli.uiGetJson(instance.realMeta)
        //instance.realReq = await uicli.uiGetJson(instance.realReq)
        
        //get resData
        var resData = await invoker.invokeInstance(instance,context,options)
        // todo  根据resData 检查数据 及反填context

    }

}

/**
 * run test @  one path
 */
exports.atestOnePath = async (yourDir,options)=>{
    options  = options || {}
    //loadInstances
    //获取 Instance
    var env =  await exports.loadInstances(yourDir)
    // {
    //     atestRoot : atestRoot,
    //     currentInstance :  currentInstance,
    //    allInstances : allInstances
    // }

    if(!env.currentInstance){
        //no currentInstance
        return {
            success : false,
            msg : 'atest:current path cannot find atest instance'.l()
        }
    }
    // get context
    var context = contextMan.get(env.atestRoot,options)
    // atest
    var report = await exports.atest(env.currentInstance,env.allInstances,context,options)


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

var pathEquils = (p1,p2)=>{
    return p1.replace(/\\/g,'/')  == p2.replace(/\\/g,'/')
}

var getId = p =>{
    return p.replace(/[\\\/:]/g,'_')
}

exports.getUpperMetas = (currentPath,root) =>{
    if(!root)
        return []
    if( pathEquils(currentPath,root)){
        return []
    }
    var upperPath = path.dirname(currentPath)
    if(pathEquils(upperPath, currentPath))
        return []
    var pJson =path.join(upperPath,'atest.json')
    var pJs = path.join(upperPath,'atest.js')
    var metas = []
    if(existsFile(pJson) ){
        metas.push(require(pJson))
    }else if(existsFile(pJs)){
        metas.push(require(pJs))
    }
    return metas.concat(exports.getUpperMetas(upperPath,root))
}

//获取单个实例
exports.loadCurrentInstance = (currentPath,root) =>{
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
    instance.upperMetas = exports.getUpperMetas(currentPath,root)
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

//获取当前目录以下所有实例
exports.loadAllInstancesUnderRoot=  rootPath =>{
    var dirs = find.dirSync(rootPath)
    var array = []
    dirs.forEach(dir =>{
        array.push(new Promise(r=>{
            r(exports.loadCurrentInstance(dir,rootPath))
        }))
    })
    return Promise.all(array)
}

//获取当前项目下所有实例
exports.loadInstances = async (currentPath) =>{
    // get atest root
    var atestRoot = exports.findAtestRootPath(currentPath)
    // get currentInstance
    var currentInstance = exports.loadCurrentInstance(currentPath,atestRoot)
    // get all  instances
    var allInstances = await exports.loadAllInstancesUnderRoot(atestRoot)
    var temp = []
     allInstances.forEach(i =>{
         if(i)
         temp.push(i)
     })
     allInstances = temp
     
     return {
         atestRoot : atestRoot,
         currentInstance :  currentInstance,
        allInstances : allInstances
     }
}