


module.exports ={
    success : "!",
    data : {
        "!p1" : null,
        p2 : "![1,100]",
        p3 : "!(1,3,4)",
        p4 : "!=$abc",
        p5 : ($) => { return true},
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
        }
    }
}