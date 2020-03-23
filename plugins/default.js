const utils = lisaUtils = require('lisa.utils')

const ilinkOptions = {
    searchScope : 1,
    scopes : []
}

if(lisaUtils.ArrayContains(process.argv,'',(b,a)=>{
        return a &&  lisaUtils.ArrayContains(["--plugins","--ilink","--ext"],a.toLowerCase()) 
     }))
{
         require("ilink.js").reg(module,"atest",ilinkOptions)
 }


 /**
  * 获取req中需求， 适用于 json中key value  ，字符串
  */
exports.getReqNeeds= async (str, options)=>{
    var needs = []
    if(utils.indexOfString(str, '$')> -1){
        if(/^\$[a-zA-Z0-9_\.]*$/.test(str)){
            needs.push(str)
        }else if(/([^>]|^)\${[a-zA-Z0-9_.]*}/.test(str)){
            str.match(/((?<=[^>])|^)\${[a-zA-Z0-9_.]*}/g).forEach(ele=>{
                needs.push(ele)
            })
        }
    }
    return needs
}

/**
 * 获取返回结果中的需求 ，仅限json中的json 和 字符串
 */
exports.getResNeeds  = exports.getReqNeeds

/**
 *  获取返回结果中的 输出  ，仅限json中的json 和 字符串
 */
exports.getResOutputs  = async (str, options) => {
    var outputs= []
    if (str.indexOf('>$') > -1) {
        if (/[a-zA-Z0-9_\.]>\$$/.test(str)) {
            var val = ('$' + str.match(/[a-zA-Z0-9_\.]*(?=>\$)/)).replace('{', '').replace('}', '')
            outputs.push(val)
        } else if (/.*>\$[a-zA-Z0-9_\.\{\}]/.test(str)) {
            var vals = str.match(/(?<=>\$)[a-zA-Z0-9_\.\{\}]*/g)
            vals.forEach(ele => {
                outputs.push(ele)
            })
        }
    }
    return outputs
}


/**
 *  获取返回结果中的 输出  ，仅限json中的key
 */
exports.getResOutputsForKey  = async (key, options) => {
    var outputs = []
    var str = key
    if (str.indexOf('>$') > -1) {
        if (/[a-zA-Z0-9_\.]>\$$/.test(str)) {
            var val = ('$' + str.match(/[a-zA-Z0-9_\.]*(?=>\$)/)).replace('{', '').replace('}', '')
            outputs.push(val)
        } else if (/.+>\$[a-zA-Z0-9_\.\{\}]*$/.test(str)) {
            var vals = str.match(/(?<=>\$)[a-zA-Z0-9_\.\{\}]*/g)
            vals.forEach(ele => {
                outputs.push(ele)
            })
        }
    }
    return outputs
}