const lisaUtils = require('lisa.utils')

const ilinkOptions = {
    searchScope : 1,
    scopes : [],
    verbose : false,
    validPeriod : 60000 * 60
}

if(lisaUtils.ArrayContains(process.argv,'',(b,a)=>{
        return a &&  lisaUtils.ArrayContains(["--plugins","--ilink","--ext"],a.toLowerCase()) 
     }))
{
         require("ilink.js").reg(module,"yourModuleName",ilinkOptions)
 }