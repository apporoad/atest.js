## res
sort for response  
返回对象，对返回值的封装

### standard res (标准完整)

```js
module.exports ={
    success : "!",
    data1 : {
        "!p1>$" : null,
        p2 : "![1,100]",
        "p3>$param3" : "!(1,3,4)",
        p4 : "!=${abc}",
        "p${p1}5" : ($) => { return true},
        "$p3" : ($) => { return true},
        "p5.5" : ">$p5.5",
        "p5.6" ; "gghgh>${p5.6,3,2}mhkj"
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
        })，
        p13 : async ()=>{
            return true
        }
    }
}
```

ps： 各种变化与req对象一致

```js
module.exports = /abc/g

module.exports = "!"

module.exports = "gg${}hgh>${p1}mhk${}j"

module.exports = { .. }

module.exports = (resultOrLastRecord,context, options)=>{  return {} }

module.exports = (resultOrLastRecord,context,options)=> { return new Promise(r=>{...})}

module.exports = async (resultOrLastRecord,context ,options)=>{ ...}

module.exports = new Promise(r=>{...})

```

atest取值与校验语法：
