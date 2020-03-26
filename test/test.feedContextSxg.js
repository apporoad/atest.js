const LJ = require('lustjson.js')
const sxg = require('../modules/res.feedContextSxg')

var lustJson ={
    success : "!",
    data1 : {
        "!p1>$" : null,
        p2 : "![1,100]",
        "p3>$param3" : "asdfsdf>${pp3}",
        p4 : "!=${abc}",
        "p${p1}5" : ($) => { return true},
        "$p3" : ($) => { return true},
        "p5.5" : ">$p5.5",
        "p5.6" : "ggh>${}hh=>${p5.6}mh>${p5.7}kjaaaaaaaaaaaaaaaa>${p5.8}cccccccc",
        p6 : "!!",
        "!p7" :  {
            p71 : "!",
            p72 : "!>12",
            p73 : "!=^.rp2"
        },
        's7' : [ 'ggh${}gh>${s7}mh>${s8}kj'],
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
        p11 : (res,context,options)=>{
            console.log(context)
            console.log(res)
            console.log( options.req)
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

var resData = {
    success : "!",
    data1 : {
        "p1" : 'here is p1',
        p2 :  99 ,
        "p3" : 33,
        p4 : ' here is p4',
        "p${p1}5" : true,
        "$p3" : true,
        "p5.5" : " here is p5.5",
        "p5.6" : "gghccchh=abcdefgmhaaaaaaakj",
        p6 : "abc",
        "p7" :  {
            p71 : 2,
            p72 : 32,
            p73 : 21
        },
        "s7" :[ 'hello'],
        "p7.5" : 56,
        p9 : /ab*/g,
        p8 : [{
            "a" : 99
        }],
        p10 : $=>{
            return {
                success : true,
                remark : 'good job'
            }
        },
        p11 : (res,context,options)=>{
            console.log(context)
            console.log(res)
            console.log( options.req)
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


var context = {}
var options = {
    resData : resData,
    context : context
}

LJ.get(lustJson,sxg,options).then(json=>{
    console.log(context)
    //console.log(json)
})