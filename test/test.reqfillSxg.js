const LJ = require('lustjson.js')
const sxg = require('../modules/req.fillSxg')

var lustJson ={
    meta : {
        url : "http://localhost:11540/${abc}/",
        name : "demoApi"
    },
    headers : {
        token : 'Bearer 255ffaf8-9c6d-4bbb-8719-a8a0f7e28412',
        Cookie : "",
    },
    data : {
        "param1": "$p1",
        "$p2" : 12,
        "param2" : 100,
        "param3" : context =>{
            return 'hello good good day'
        },
        "param4": context=>{
            return new Promise((r)=>{r(1)})
        }
        ,"param5" : ["$p3","hello ${p4} world"],
        "param6" : [{
            hello : "$p3",
            "aa${p3}" : "world"
        }]
    }
}

var options ={
    context:{
        "$p1" : { hello : "world"},
        $p3 : 'abc',
        $p4 : {
            hi :"LiSA"
        }
     }
}
LJ.get(lustJson,sxg,options).then(d=>{
    console.log(d)
})