// instanceManager  测试实例 管理器

const utils = require('lisa.utils')



exports.preduleInstance = (instance, context) => {

    return {
        id: '',
        instance: {},
        needs: [],
        outputs: []
    }
}

var instanceEquils = (a, b) => {
    return a.id == b.id
}


//recurse
var getInvokChain = (instance, allInstances, context, outputs) => {
    //del itself first
    if(utils.ArrayContains(allInstances,instance,instanceEquils)){
        var i = utils.ArrayIndexOf(allInstances,instance,instanceEquils)
        allInstances.splice(i,1)
    }

    var guess = exports.preduleInstance(instance, context)
    var newOutputs = outputs
    if (!guess.needs || guess.needs.length == 0) {
        if (guess.outputs && guess.outputs.length > 0) {
            newOutputs = newOutputs.contact(guess.outputs)
        }
        return {
            chain: [instance],
            outputs: newOutputs
        }
    }
    // 这里是存在 新的needs
    for(var index =0 ;index < guess.needs.length;index++){
        var tneed = guess.needs[index]
        if(context[tneed]){
            continue
        }
        var availableChains =[]
        for(var j =0;j<allInstances.length;j++){
            var tg = exports.preduleInstance(allInstances[j],context)
            if(tg.outputs && tg.outputs.length>0 && utils.ArrayContains(tg.outputs,tneed)){
                availableChains.push(getInvokChain(allInstances[j], allInstances.contact([]),context))
            }
        }
        if(availableChains.length>0){
            //todo
        }
    }    


    return { outputs: [] }

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