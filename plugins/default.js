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
exports.getReqNeeds=(str, options)=>{
    options  = options || {}
    options.$ = options.$ || []
    if(utils.indexOfString(str, '$')> -1){
        if(/^\$[a-zA-Z0-9_\.]*$/.test(str)){
            if(!utils.ArrayContains(options.$,str))
                options.$.push(str)
        }else if(/([^>]|^)\${[a-zA-Z0-9_.]*}/.test(str)){
            str.match(/((?<=[^>])|^)\${[a-zA-Z0-9_.]*}/g).forEach(ele=>{
                var s = ele.replace(/\{?\}?/g,'')
                if(!utils.ArrayContains(options.$,s))
                    options.$.push(s)
            })
        }
    }
}

/**
 * 获取返回结果中的需求 ，仅限json中的json 和 字符串
 */
exports.getResNeeds  = (str, options) => {
    options = options || {}
    options.$ = options.$ || []
    if (utils.indexOfString(str, '$') > -1) {
        if (/^\$[a-zA-Z0-9_\.]*$/.test(str)) {
            if (!utils.ArrayContains(options.$, str))
                options.$.push(str)
        } else if (/\${[a-zA-Z0-9_\.]*}/.test(str)) {
            str.match(/\${[a-zA-Z0-9_\.]*}/g).forEach(ele => {
                var s = ele.replace(/\{?\}?/g, '')
                if (!utils.ArrayContains(options.$, s))
                    options.$.push(s)
            })
        }
    }
}

/**
 *  获取返回结果中的 输出  ，仅限json中的json 和 字符串
 */
exports.getResOutputs  = (str, options) => {
    options = options || {}
    options.$out = options.$out || []

    if (str.indexOf('>$') > -1) {
        if (/[a-zA-Z0-9_\.]>\$$/.test(str)) {
            var val = ('$' + str.match(/[a-zA-Z0-9_\.]*(?=>\$)/)).replace('{', '').replace('}', '')
            if (!utils.ArrayContains(options.$out, val))
                options.$out.push(val)
        } else if (/.*>\$[a-zA-Z0-9_\.\{\}]/.test(str)) {
            var vals = str.match(/(?<=>\$)[a-zA-Z0-9_\.\{\}]*/g)
            vals.forEach(ele => {
                var val = '$' + ele.replace('{', '').replace('}', '')
                if (!utils.ArrayContains(options.$out, val))
                    options.$out.push(val)
            })
        }
    }

}