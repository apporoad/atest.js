// instanceManager  测试实例 管理器

const utils = require('lisa.utils')



exports.preduleInstance = (instance, context) => {

    return new Promise((r, j) => {
        if (instance.isTest) {
            r(instance)
            return
        }

        r({
            id: '',
            instance: {},
            needs: [],
            outputs: []
        })
    })
}

var instanceEquils = (a, b) => {
    return a.id == b.id
}


//recurse
// 递归获取调用链
var getInvokChain = async (instance, allInstances, context, allOutputs, deep) => {
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

    var guess = await exports.preduleInstance(instance, context)
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
            var tg = await exports.preduleInstance(allInstances[j], context)
            if (tg.outputs && tg.outputs.length > 0 && utils.ArrayContains(tg.outputs, tneed)) {
                var temp = await getInvokChain(allInstances[j], allInstances.concat([]), context, allOutputs, deep ? (deep + 1) : 0)
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

var getOrderedInstances = (testingInstance, allInstances, context) => {
    if (!testingInstance) return []
    var testingArray = []
    var needs = []
    var outputs = []
    if (!utils.Type.isArray(testingInstance)) {
    } else {
    }

}

exports.getOrderedInstances = getOrderedInstances

exports.getInvokChain = getInvokChain