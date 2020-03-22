// instanceManager  测试实例 管理器

const utils = require('lisa.utils')
const l = require('locale.node')
const reqNeedsAndOutpusSxy = require('./req.needsAndOutputsSxg')
const resNeedsAndOutputSxy = require('./res.needsAndOutputsSxg')
const LustJson = require('lustjson.js')
const reqTranslateSxg =require('./req.translateSxg')
const resTranslateSxg = require('./res.translateSxg')


var translateMeta = async (meta, context, options) => {
    if (!meta) return {}
    if (utils.Type.isAsyncFunction(meta)) {
        meta = await meta(context, options)
    } else if (utils.Type.isFunction(meta)) {
        meta = meta(context, options)
    }
    if (meta) {
        return await Promise.resolve(meta)
    }
    return {}
}

/**
 * 解决 meta 和 req 中的 函数 和 json中的函数
 */
exports.translateReq = async (instance , context , options) =>{
    if (!instance) return
    if (instance.req) {
        var req = instance.req
        if (utils.Type.isAsyncFunction(instance.req)) {
            try {
                req = await instance.req(context, options)
            } catch (e) {
                req = null
                instance.errors = instance.errors || {}
                instance.errors.reqTranslate = {
                    msg: l('call asyncFunction error when translate req'),
                    ex: e
                }
            }
        } else if (utils.Type.isFunction(instance.req)) {
            try {
                req = instance.req(context, options)
            } catch (e) {
                req = null
                instance.errors = instance.errors || {}
                instance.errors.reqTranslate = {
                    msg: l('call function error when translate req'),
                    ex: e
                }
            }
        }
        if (req) {
            var req = await Promise.resolve(req)
            //translate req json 
            if(utils.Type.isObject(req)){
                var ops = {
                    context : context,
                    options : options
                }
                req = await LustJson.get(req,reqTranslateSxg,ops)
            }
            instance.realReq =    req
        }
    }
    //metas
    try {
        var meta = null
        if (instance.realReq && instance.realReq.meta) {
            meta = await translateMeta(instance.realReq.meta, context, options)
        }
        if (instance.meta) {
            meta = Object.assign({}, await translateMeta(instance.meta, context, options), meta)
        }
        if (instance.upperMetas) {
            for (var i = 0; i < instance.upperMetas.length; i++) {
                meta = Object.assign({}, await translateMeta(instance.upperMetas[i], context, options), meta)
            }
        }
        //translate meta
        var ops = {
                    context : context,
                    options : options
                }
        meta = await LustJson.get(meta,reqTranslateSxg,ops)
        instance.realMeta = meta
    } catch (e) {
        instance.errors = instance.errors || {}
        instance.errors.metaTranslate = {
            msg: l('call function error when translate meta'),
            ex: e
        }
    }
}

/**
 *  解决 res 中的函数和 json中函数
 */
exports.translateRes = async (instance,resData,context,options) =>{
     if (!instance) return
    if (instance.res) {
        var res = instance.res
        if (utils.Type.isAsyncFunction(res)) {
            try {
                res = await instance.res(resData,context, options)
            } catch (e) {
                res = null
                instance.errors = instance.errors || {}
                instance.errors.resTranslate = {
                    msg: l('call asyncFunction error when translate res'),
                    ex: e
                }
            }
        } else if (utils.Type.isFunction(res)) {
            try {
                res = instance.res(resData,context, options)
            } catch (e) {
                res = null
                instance.errors = instance.errors || {}
                instance.errors.resTranslate = {
                    msg: l('call function error when translate res'),
                    ex: e
                }
            }
        }
        if (res) {
            res  = await Promise.resolve(res)
            // translate res
            if(utils.Type.isObject(res)){
                var ops = {
                    context : context,
                    options : options,
                    resData : resData
                }
                res = await LustJson.get(res,resTranslateSxg,ops)
            }
            instance.realRes = res
        }
    }
}
/**
 * 翻译实例，解决instance中的异步函数、函数 和 promise
 */
exports.translateInstance = async (instance, context, options) => {
    await exports.translateReq(instance,context,options)
    //todo get lastRecord resData
    await exports.translateRes(instance,null,context,options)
}

/**
 * 预测测试实例
 */
exports.preduleInstance = async (instance, context, options) => {
    //here test
    if (instance.isTest) {
        return instance
    }
    //here resolve the  async function  and function   and promise ...    
    await exports.translateInstance(instance, context, options)
    // get needs and outpus
    var tempOption = { $: [], $out: [] }
    if (instance.realMeta)
        await LustJson.get(instance.realMeta, reqNeedsAndOutpusSxy, tempOption)
    if (instance.realReq) {
        if (utils.Type.isString(instance.realReq)) {
            //todo
        } else if (utils.Type.isObject(instance.req)) {
            await LustJson.get(instance.realReq, reqNeedsAndOutpusSxy, tempOption)
        } else {
            //todo 
        }
    }

    if (instance.realRes) {
        if (utils.Type.isObject(instance.realRes)) {
            await LustJson.get(instance.realRes, resNeedsAndOutputSxy, tempOption)
        }else if( utils.Type.isString(instance.realRes)){
            //todo
        }
    }
    instance.needs = tempOption.$
    instance.outputs = tempOption.$out
    // r({
    //     id: '',
    //     instance: {},
    //     needs: [],
    //     outputs: []
    // })
    return instance
}

var instanceEquils = (a, b) => {
    return a.id == b.id
}


//recurse
// 递归获取调用链
var getInvokChain = async (instance, allInstances, context, allOutputs, deep, options) => {
    //deep 
    if (deep && deep > 10) {
        return {
            chain: []
        }
    }
    //del itself first
    if (utils.ArrayContains(allInstances, instance, instanceEquils)) {
        var i = utils.ArrayIndexOf(allInstances, instance, instanceEquils)
        allInstances.splice(i, 1)
    }

    var guess = await exports.preduleInstance(instance, context, options)
    if (!guess.needs || guess.needs.length == 0) {
        if (guess.outputs && guess.outputs.length > 0) {
        }
        return {
            chain: [instance],
            outputs: guess.outputs
        }
    }
    // 这里是存在 新的needs
    var chainObjs = []
    var newOutputs = allOutputs ? allOutputs : []
    var unSatisfiedNeeds = []
    for (var index = 0; index < guess.needs.length; index++) {
        var tneed = guess.needs[index]
        if (context[tneed]) {
            continue
        }
        if (utils.ArrayContains(newOutputs, tneed)) {
            continue
        }
        var availableChains = []
        for (var j = 0; j < allInstances.length; j++) {
            var tg = await exports.preduleInstance(allInstances[j], context, options)
            if (tg.outputs && tg.outputs.length > 0 && utils.ArrayContains(tg.outputs, tneed)) {
                var temp = await getInvokChain(allInstances[j], allInstances.concat([]), context, allOutputs, deep ? (deep + 1) : 0, options)
                availableChains.push(temp)
            }
        }
        //如果符合条件的调用链有多个
        if (availableChains.length > 0) {
            //排序
            availableChains.sort((a, b) => {
                var aNeeds = a.needs && a.needs.length > 0 ? 1 : 0
                var bNeeds = b.needs && b.needs.length > 0 ? 1 : 0
                if (aNeeds != bNeeds) {
                    return aNeeds - bNeeds
                } else {
                    return -(b.chain.length - a.chain.length)
                }
            })

            var rc = availableChains[0]
            chainObjs.push(rc)
            if (rc.outputs && rc.outputs.length > 0)
                newOutputs = newOutputs.concat(rc.outputs)
        }
        else {
            unSatisfiedNeeds.push(tneed)
        }
    }
    //如果有chain，合并去重后返回
    if (chainObjs.length > 0) {
        //添加自身
        chainObjs.push({
            chain: [instance],
            outputs: guess.outputs,
            needs: unSatisfiedNeeds
        })
        var realChain = []
        var realNeeds = []
        // 整理去重
        chainObjs.forEach(obj => {
            //console.log('asdfsdfsssssssssssssssssss' +obj)
            obj.chain.forEach(ch => {
                if (!utils.ArrayContains(realChain, ch, instanceEquils)) {
                    realChain.push(ch)
                }
            })
            if (obj.needs && obj.needs.length > 0) {
                obj.needs.forEach(n => {
                    //console.log(n + '' + JSON.stringify(obj))
                    if (!utils.ArrayContains(realNeeds, n)) {
                        realNeeds.push(n)
                    }
                })
            }
        })
        //outputs 去重
        if (guess.outputs && guess.outputs.length > 0)
            newOutputs = newOutputs.concat(guess.outputs)
        var finalOutputs = []
        newOutputs.forEach(op => {
            if (!utils.ArrayContains(finalOutputs, op)) {
                finalOutputs.push(op)
            }
        })
        return {
            chain: realChain,
            outputs: finalOutputs,
            needs: realNeeds
        }
    }
    else {
        return {
            chain: [instance],
            outputs: guess.outputs,
            needs: guess.needs
        }
    }
}

var getOrderedInstances = async (testingInstance, allInstances, context, options) => {
    if (!testingInstance) return []
    var needs = []
    if (utils.Type.isArray(testingInstance)) {
        /*{
            chain: [instance],
            outputs: guess.outputs,
            needs: unSatisfiedNeeds
        }*/
        var all = allInstances.concat([])
        var allOutputs = []
        var chain = []
        var needs = []
        for (var i = 0; i < testingInstance.length; i++) {
            if (all.length == 0) break
            if (!utils.ArrayContains(all, testingInstance[i], instanceEquils)) {
                continue
            }
            var tempChain = await getInvokChain(testingInstance[i], all, context, allOutputs, 0, options)
            allOutputs = allOutputs.concat(tempChain.outputs || [])
            chain = chain.concat(tempChain.chain || [])
            all = utils.ArrayRemove(all, tempChain.chain || [], instanceEquils)
            needs = needs.concat(tempChain.needs || [])
        }
        return {
            chain: chain,
            needs: utils.ArrayDistinct(needs),
            outputs: utils.ArrayDistinct(allOutputs)
        }
    } else {
        return getInvokChain(testingInstance, allInstances, context, options)
    }
}

exports.getOrderedInstances = getOrderedInstances

exports.getInvokChain = getInvokChain

