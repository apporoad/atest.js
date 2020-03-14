// here main of atest

const instanceMan = require('./instanceMan')
const contextMan = require('./contextMan')

/**
 * run atest
 */
exports.atest =(testingInstances,allInstances)=>{
    //1.  get pre instances
    var orderedInstances = instanceMan.getOrderedInstances(testingInstances,allInstances,contextMan.getAvailableContext())
    
}