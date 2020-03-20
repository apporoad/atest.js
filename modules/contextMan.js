// here manage the context manager

const fs = require('fs')
const path = require('path')

//默认三天超时
var defaultOutTimeInterval = 60*60*24*3


exports.get = (root,options)=>{
    options = options || {}
    options.timeOut = options.timeOut || defaultOutTimeInterval
    var p = path.join(root,'.atest/context.json')
    if(fs.existsSync(p)){
        var json = JSON.parse(fs.readFileSync(p,'utf8'))
        var result = {}
        for(key in json){
            if(json[key] && json[key].date && (json[key].date.valueOf() +options.timeOut*1000)> Date.now()){
                result[key] = json[key].value
                //json[key].date = Date.now()
            }else{
                json[key] = null
            }
        }
        fs.writeFileSync(p, JSON.stringify(json),'utf8')
        return result
    }
    return {}
}

exports.set = (newContext,root) =>{
    if(!newContext) return
    var p = path.join(root,'.atest/context.json')
    var json = newContext
    if(fs.existsSync(p)){
        json = Object.assign({},exports.get(root),newContext)
    }
    var realJson ={}
    for(key in json){
        realJson[key] ={
            value : json[key],
            date : Date.now()
        }
    }
    if(!path.join(root,'.atest')){
        fs.mkdirSync(path.join(root,'.atest'))
    }
    fs.writeFileSync(p,JSON.stringify(realJson),'utf8')
}