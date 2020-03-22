// req 只有needs

const utils = require('lisa.utils')

const pulgin =require('../plugins/default')



/**
 * here is the start
 * 故事开始的地方
 */
exports.prelude = options=>{}

/**
 * 判断数据中的字符串是否是Lust
 */
exports.isLustForString = (str,options) =>{ 
    return false 
}

/**
 * 获取lust from String
 */
exports.getLustForString = function(str,options){ return {} }

/**
 * 判断数组中对象是否是Lust
 *  如果是promise
 */
exports.isLustForObject = (obj,options) =>{ 
    if(typeof obj.then === 'function') {
        return true
    }
    return false 
}

/**
 * 获取lust from Object
 */
exports.getLustForObject = async (obj,options)=>{ 
    return  await Promise.resolve(obj)
 } 

/**
 * "param1": "$p1",
 * is the node of json  a lust , example : { '???':{ 'hello': 'world'}}
 * 判断json中的节点是否是lust
 */
exports.isLustForKV = (k,v,options)=>{ 
    // if(v){
    //     if(typeof v.then === 'function') {
    //         return true
    //     }
    // }
    return false
}

/**
 * get lustInfo from node of json when isLustForKV is true
 * 获取lust 
 */
exports.getLustForKV = async (k,v,options) => { 
    //return await Promise.resolve(v)
    return  await v
}

/**
 * is the node of other  a lust , example :  ()=>{}
 * 判断json中的节点是否是lust
 */
exports.isLustForOthers= (obj,options)=>{ 
    if(utils.Type.isAsyncFunction(obj))
    {
        return true
    }else if(utils.Type.isFunction(obj)){
        return true
    } else if(utils.Type.isFunction(obj.then) ){
        return true
    }
    return false
}

/**
 * get lustInfo from node of json when isLustForOthers is true
 * 获取lust 
 */
exports.getLustForOthers= async (obj,options) => { 
    options = options || {}
    options.context = options.context || {}
    options.options = options.options || {}
    if(utils.Type.isAsyncFunction(obj)){
        return  await obj(options.context,options.options )
    }else if(utils.Type.isFunction(obj)){
        return obj(options.context,options.options)
    } else if(obj && utils.Type.isFunction(obj.then)){
        return await obj
    }
    return null
}


/**
 * 满足一个lust节点前触发行为 
 */
exports.beforeSatifyOneLust = (lustInfo,options)=>{}

/**
 * 满足一个lust节点后触发行为
 */
exports.afterSatifyOneLust = (lustInfo,options) =>{}

/**
 * 满足所有lust之后触发行为
 */
exports.afterSatifyAllLust = (lustJson,options) =>{
    return  {
        isRemakeLustJson : false
    }
}

/**
 * sexgirl核心逻辑， 为 一个lust填充值
 * core logic @ sex girl, get real value for a lust
 */
exports.getInputOneLustValue = (lustInfo,lastData,options) =>{
    
    //console.log(lustInfo)
    return  lustInfo.value
}

/**
 * getInputOneLustValue后面的方法，校验输入值
 * method after getInputOneLustValue
 */
exports.validateOneLustInfo = (value,lustInfo,lastData,options) =>{
    return {
        isPass : true,
        value : value
    }
}