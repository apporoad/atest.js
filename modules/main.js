// here main of atest

const instanceMan = require('./instanceMan')
const contextMan = require('./contextMan')

/**
 * run atest
 */
exports.atest = async (testingInstances,allInstances)=>{
    //1.  get pre instances
    var orderedInstances = await instanceMan.getOrderedInstances(testingInstances,allInstances,contextMan.getAvailableContext())
    
    //contextMan.getOrderedInstances
}