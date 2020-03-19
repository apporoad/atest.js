const LustJson = require('lustjson.js')
const sxg = require('../modules/req.needsAndOutputsSxg')
const sxg2 =require('../modules/res.needsAndOutputsSxg')

var json ={
    meta : {
        id : "atest.js_demo_case001",
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
        },
        "param5" : ["$p3","hello ${p3} world"],
        "param6" : [{
            hello : "$p3",
            "$p4" : "world"
        }]
    }
}
// var options = {$:[], serial :true}
// LustJson.get(json,sxg,options).then(()=>{
//     console.log(options.$)
// })

var json2 ={
    success : "!",
    data1 : {
        "!p1>$" : null,
        p2 : "![1,100]",
        "p3>$param3" : "!(1,3,4)",
        p4 : "!=${abc}",
        "p${p1}5" : ($) => { return true},
        "$p3" : ($) => { return true},
        "p5.5" : ">$p5.5",
        "p5.6" : "gghgh>${p5.6,3,2}mhkj",
        p6 : "!!",
        "!p7" :  {
            p71 : "!",
            p72 : "!>12",
            p73 : "!=^.rp2"
        },
        "p7.5" : "!=$.p4",
        p9 : /ab*/g,
        p8 : [{
            "!a" : "![1,100]" 
        }],
        p10 : $=>{
            return {
                success : true,
                remark : 'good job'
            }
        },
        p11 : (res,req,context)=>{
            console.log(context)
            console.log(res)
            console.log(req)
            return new Promise((r,j)=>{
                setTimeout(()=>{
                    r(true)
                },500)
            })
        },
        p12 : new Promise((r,j)=>{
            r(true)
        }),
        p13 : async ()=>{
            return true
        }
    }
}

var options = {$:[], serial :true,$out:[]}
LustJson.get(json2,sxg2,options).then(()=>{
    console.log(options.$)
    console.log(options.$out)
})