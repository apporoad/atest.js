// instanceManager  测试实例 管理器

const utils = require('lisa.utils')
const l = require('locale.node')
const reqNeedsAndOutpusSxy = require('./req.needsAndOutputsSxg')
const resNeedsAndOutputSxy = require('./res.needsAndOutputsSxg')
const LustJson = require('lustjson.js')

/**
 * 翻译实例，解决instance中的异步函数、函数 和 promise
 */
exports.translateInstance = async (instance,context,options)=>{
    if(!instance)return
    if(instance.req){
        var req = instance.req
        if(utils.Type.isAsyncFunction(instance.req)){
            try{
                req = await instance.req(context,options)
            }catch(e){
                req = null
                instance.errors = instance.errors || {}
                instance.errors.reqTranslate = {
                    msg :  l('call asyncFunction error when translate req'),
                    ex : e
                }
            }
        }else if( utils.Type.isFunction(instance.req)){
            try{
                req = instance.req(context,options)
            }catch(e){
                req =null
                instance.errors = instance.errors || {}
                instance.errors.reqTranslate = {
                    msg :  l('call function error when translate req'),
                    ex : e
                }
            }
        }
        if(req){
            instance.realReq  = await Promise.resolve(req)
        }
    }

    if(instance.res){
        var res = instance.res
        if(utils.Type.isAsyncFunction(res)){
            try{
                //todo get lastRecord
                res  = await instance.res(context, null,options)
            }catch(e){
                res = null
                instance.errors = instance.errors || {}
                instance.errors.resTranslate = {
                    msg : l('call asyncFunction error when translate res'),
                    ex: e
                }
            }
        } else if (utils.Type.isFunction(res)){
            try{
                //todo get latRecord
                res = instance.res(context,null,options)
            }catch(e){
                res = null
                instance.errors = instance.errors || {}
                instance.errors.resTranslate = {
                    msg : l('call function error when translate res'),
                    ex : e
                }
            }
        }
        if(res){
            instance.realRes = await Promise.resolve(res)
        }
    }
}

/**
 * 预测测试实例
 */
exports.preduleInstance = async (instance, context ,options) => {
    //here test
    if (instance.isTest) {
        return instance
    }
    //here resolve the  async function  and function   and promise ...    
    await exports.translateInstance(instance,context,options)
    // get needs and outpus
    var tempOption = {$:[],$out:[]}
    if(instance.meta)
        await LustJson.get(instance.meta,reqNeedsAndOutpusSxy,tempOption)
    if(instance.req)
        await LustJson.get(instance.req, reqNeedsAndOutpusSxy,tempOption)
    if(instance.res)
        await LustJson.get(instance.res , resNeedsAndOutputSxy,tempOption)
    
        instance.needs  = tempOption.$
        instance.outputs =tempOption.$out
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
var getInvokChain = async (instance, allInstances, context, allOutputs,deep, options) => {
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

    var guess = await exports.preduleInstance(instance, context,options)
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
            var tg = await exports.preduleInstance(allInstances[j], context,options)
            if (tg.outputs && tg.outputs.length > 0 && utils.ArrayContains(tg.outputs, tneed)) {
                var temp = await getInvokChain(allInstances[j], allInstances.concat([]), context, allOutputs, deep ? (deep + 1) : 0,options)
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
        else{
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
        if(guess.outputs && guess.outputs.length >0)
            newOutputs = newOutputs.concat(guess.outputs)
        var finalOutputs = []
        newOutputs.forEach(op =>{
            if(!utils.ArrayContains(finalOutputs,op)){
                finalOutputs.push(op)
            }
        })
        return {
            chain: realChain,
            outputs:  finalOutputs,
            needs: realNeeds
        }
    }
    else
    {
        return {
            chain: [instance],
            outputs: guess.outputs,
            needs: guess.needs
        }
    }
}

var getOrderedInstances = async (testingInstance, allInstances, context,options) => {
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
        for(var i =0;i<testingInstance.length;i++){
            if(all.length == 0 ) break
            if(!utils.ArrayContains(all,testingInstance[i],instanceEquils)){
                continue
            }
            var tempChain = await getInvokChain(testingInstance[i],all,context,allOutputs,0,options)
            allOutputs =allOutputs.concat(tempChain.outputs || [])
            chain = chain.concat(tempChain.chain || [])
            all = utils.ArrayRemove(all, tempChain.chain || [] , instanceEquils)
            needs = needs.concat(tempChain.needs || [])
        }
        return {
            chain : chain,
            needs : utils.ArrayDistinct(needs),
            outputs :  utils.ArrayDistinct(allOutputs)
        }
    } else {
        return getInvokChain(testingInstance,allInstances,context,options)
    }
}

exports.getOrderedInstances = getOrderedInstances

exports.getInvokChain = getInvokChain

