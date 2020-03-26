// res 只有values 中 存在 needs
// res key 中存在 outputs

const utils = require('lisa.utils')

const plugin = require('../plugins/default')

const ljson = require('lisa.json')


/**
 * here is the start
 * 故事开始的地方
 */
exports.prelude = options => { }

/**
 * 
 * "param5" : ["$p3","hello ${p3} world"],
 * is the string in Array a lust, example :   [ 'abc','???' ]
 * 判断数据中的字符串是否是Lust
 */
exports.isLustForString = async (str, options, LJ) => {
    var outputs = await plugin.getResOutputs(str, options)
    if (outputs && outputs.length > 0) {
        for(var i =0 ;i<outputs.length ;i ++){
            var element = outputs[i]
             // console.log(str  + '  |  ' + outputs[0]+  ' | '+ JSON.stringify(LJ.LJ))
            var realKey = element.replace('{', '').replace('}', '')
            //console.log('sdfsdf : ' +LJ.LJ.dotTree)
            options.context[realKey] = await Promise.resolve(plugin.drawRealValue(str, ljson(options.resData).get(LJ.LJ.dotTree), element))
        }
    }
    return false
}

/**
 * get lustInfo from String when isLustForString is true
 * 获取lust from String
 */
exports.getLustForString = function (str, options) { return {} }

/**
 * is the Object in Arry a lust  ,example : [{ isLust: true, hello: ' world'}]
 * 判断数组中对象是否是Lust
 */
exports.isLustForObject = (obj, options) => { return false }

/**
 * get lustInfo from Object when isLustForObject is true
 * 获取lust from Object
 */
exports.getLustForObject = (obj, options) => { return {} }

/**
 * "param1": "$p1",
 * is the node of json  a lust , example : { '???':{ 'hello': 'world'}}
 * 判断json中的节点是否是lust
 */
exports.isLustForKV = async (k, v, options, LJ) => {
    // await getNeeds(k,options)
    // await getOutputsForKey(k,options)
    // if (v && utils.Type.isString(v)) {
    //     await getNeeds(v,options)
    //     await getOutputs(v,options)
    // }

    var outputs = (await plugin.getResKeyOutputsPairForKey(k, options))
    if (outputs && outputs.length > 0) {
        //console.log(k +   ' | '  + outputs[0] +'   |  ' + JSON.stringify(LJ.LJ))
        var pair = outputs[0]
        options.context[pair.output] = await plugin.drawRealValue(k,
            ljson(options.resData).get(LJ.LJ.dotTree.replace('???', utils.startTrim(pair.key, '$'))),
            pair.output)
        return true
    }
    return false
}

/**
 * get lustInfo from node of json when isLustForKV is true
 * 获取lust 
 */
exports.getLustForKV = async (k, v, options, LJ) => {
    var outputs = (await plugin.getResKeyOutputsPairForKey(k, options))
    var pair = outputs[0]
    return utils.startTrim(pair.key, '$')
}

/**
 * is the node of other  a lust , example :  ()=>{}
 * 判断json中的节点是否是lust
 */
exports.isLustForOthers = (k, v, options) => { return false }

/**
 * get lustInfo from node of json when isLustForOthers is true
 * 获取lust 
 */
exports.getLustForOthers = (k, v, options) => { return {} }


/**
 * 满足一个lust节点前触发行为 
 */
exports.beforeSatifyOneLust = (lustInfo, options) => { }

/**
 * 满足一个lust节点后触发行为
 */
exports.afterSatifyOneLust = (lustInfo, options) => { }

/**
 * 满足所有lust之后触发行为
 */
exports.afterSatifyAllLust = (lustJson, options) => {
    return new Promise((r, j) => {
        r({
            isRemakeLustJson: false
        })
    })
}

/**
 * sexgirl核心逻辑， 为 一个lust填充值
 * core logic @ sex girl, get real value for a lust
 */
exports.getInputOneLustValue = (lustInfo, lastData, options) => {
    return lustInfo.value
}

/**
 * getInputOneLustValue后面的方法，校验输入值
 * method after getInputOneLustValue
 */
exports.validateOneLustInfo = (value, lustInfo, lastData, options) => {
    return new Promise((r, j) => {
        r({
            isPass: true,   // important result ,  will reRun when false
            isKeepLust: false, // nullable, when true , the lust won't be deleted
            key: value,// nullable， only you need change your key in json
            value: lustInfo.LJ.object[lustInfo.LJ.key] // important result , your real value against lust
        })
    })
}