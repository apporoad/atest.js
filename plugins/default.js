const utils = lisaUtils = require('lisa.utils')
const ljson = require('lisa.json')

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
        } else if (/.*>\$[a-zA-Z0-9_\.]/.test(str)) {
            var vals = str.match(/(?<=>)\$[a-zA-Z0-9_\.]*/g)
            vals.forEach(ele => {
                outputs.push(ele)
            })
        } else if (/.*>\$\{[a-zA-Z0-9_\.]*\}.*/.test(str)) {
            var vals = str.match(/(?<=>)\$\{[a-zA-Z0-9_\.]+\}/g)
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
            var vals = str.match(/(?<=>)\$[a-zA-Z0-9_\.\{\}]*/g)
            vals.forEach(ele => {
                outputs.push(ele)
            })
        }
    }
    return outputs
}

/**
 *  获取返回结果中的 输出  ，仅限json中的key
 *  {
 *      key :  'p1'
 *      output :  '$param3'
 * }
 */
exports.getResKeyOutputsPairForKey  = async (key, options) => {
    var outputs = []
    var str = key
    if (str.indexOf('>$') > -1) {
        if (/[a-zA-Z0-9_\.]>\$$/.test(str)) {
            var val = ('$' + str.match(/[a-zA-Z0-9_\.]*(?=>\$)/)).replace('{', '').replace('}', '')
            outputs.push({
                key : val,
                output :val
            })
        } else if (/.+>\$[a-zA-Z0-9_\.\{\}]*$/.test(str)) {
            var keys = str.match(/[a-zA-Z0-9_\.]+(?=>\$[a-zA-Z0-9_\.\{\}]*)/g)
            var ops  =   str.match(/(?<=>)\$[a-zA-Z0-9_\.\{\}]*/g)
            for(var i =0;i<keys.length ;i++){
                outputs.push({
                    key : keys[i],
                    output : ops[i]
                })
            }
        }
    }
    return outputs
}


/**
 * 抽取真实的返回值
 * 
 *  expression  :   'ggh${}gh>${s7}mh>${s8}kj'
 * 
 *  matchValue :  'gghghaaaaamhxxkj'
 * 
 *  output :  $s7
 */
exports.drawRealValue = async (expression , matchValue,output )=>{
    if(expression && matchValue && output){
        if( utils.Type.isString(expression) && utils.Type.isString(matchValue)){
            var target = output.replace('{','').replace('}','').replace().replace('$','>${')  + '}'
            if(target.length == matchValue.length)
                return matchValue
            var startIndex = expression.indexOf( target)
            var before = ''
            if(startIndex> -1){
                before = expression.substring(0,startIndex)
                var splited = before.split(/>\$\{.*\}/)
                before = splited[splited.length -1]
            }
            var after = ''
            if(startIndex + target.length  < expression.length){
                after = expression.substring(startIndex + target.length + 1)
                after= after.split(/>\$\{.*\}/)[0]
            }
            if(before || after){
                var bi = 0 ; var be = matchValue.length -1
                if(before){
                    bi =  matchValue.indexOf(before)
                }
                if(after){
                    be = matchValue.indexOf(after, bi > -1 ? (bi + before.length): 0)
                }
                if(be > bi && bi> -1 ){
                    return matchValue.substring(bi +before.length,be-1)
                }else{
                    return null
                }
                // else if(be ==-1 && bi > -1){
                //     return matchValue.substring(bi + before.length)
                // }
            }
        }
    }
    return matchValue
}


/**
 *  用context 填充字符串
 */
exports.fillNeedsForString = async (str,context,fnGeReqNeeds,options)=>{
    fnGeReqNeeds = fnGeReqNeeds || exports.getReqNeeds
    var needs = (await Promise.resolve(fnGeReqNeeds(str, options)))
    var result = str
    // 如果  单纯 $abc 情况
    if(needs.length == 1 && needs[0] == str){
        return ljson(context).get(exports.getRealNeed(needs[0])) 
    }
    // 多个 asb${abc}sfds${ccc}sfdsf  情况
    for (var i = 0; i < needs.length; i++) {
        var op = needs[i]
        var val = ljson(context).get(exports.getRealNeed(op)) || ''
        result = result.replace(new RegExp(op.replace('$', '\\$').replace('{', '\\{').replace('}', '\\}'), 'gm'), val)
    }
    return result
}

/**
 *  ${abc.22} => abc.22
 */
exports.getRealNeed = need =>{
    if(need == undefined || need ==null)
        return null
    return need.replace(/\$|\{|\}/g,'')
}