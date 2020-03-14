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

var getInvokChain = (instance, allInstances, context, outputs) => {
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

} return { outputs: [] } } 
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