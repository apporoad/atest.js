
var $abc = /^\$[a-zA-Z0-9_\.]*$/
var $kuohao = /([^>]|^)\${[a-zA-Z0-9_.]*}/
var test = ()=>{
    var itest = (reg,str) => {
        console.log( str  + ' : ' + reg.test(str) )
    }

    itest($abc, "$sdfsdf")
    itest($abc, "ssdfsdf$")
    itest($abc, "$sdfsdf.asf")
    itest($abc, "$.sdfsdf")
    itest($abc, "asf$sdfsdf")
    itest($abc, "asf$sdfsdf")
    itest($abc, "$sdfsdf(12")
    console.log('===========================================')
    itest($kuohao, "$asdfsdf")
    itest($kuohao, "${}")
    itest($kuohao, "${asdf_.}")
    itest($kuohao, "${asdf,1_}")
    itest($kuohao, "asdfsf${asdf_.}asdf")
    itest($kuohao, "asdfsf${asdf_.asdf")
    itest($kuohao, "asdfsf$asdf_.}asdf")
    itest($kuohao, "asdfsf>${asdf_.}asdf")
}


test()
console.log("asd${}fsf>${abc}asdfasdfsf${cda}asdfasdfsf${ddd}asdf".match(/((?<=[^>])|^)\${[a-zA-Z0-9_.]*}/g,))
console.log("${}".match(/((?<=[^>])|^)\${[a-zA-Z0-9_.]*}/g,))
console.log(">${}".match(/((?<=[^>])|^)\${[a-zA-Z0-9_.]*}/g,))


console.log('here outputs++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')


var $outputsIs  = /^\$[a-zA-Z0-9_\.]*$/



var fnOutputs = (str) =>{
    var iTest = (reg,str,getReg) =>{
        var is = reg.test(str)
        var value = ''
        if(is){
            if(getReg)
                value ='$' + str.match(getReg)
        }
        else 
            return
        console.log(str  + ' : ' + is  + ' : ' + value)
    }
    if(str.indexOf('>$')> -1){
        // "!p1>$"   "p2>$" 
        iTest(/[a-zA-Z0-9_\.]>\$$/,str, /[a-zA-Z0-9_\.]*(?=>\$)/)
        iTest(/.*>\$[a-zA-Z0-9_\.\{\}]/,str,/(?<=>\$)[a-zA-Z0-9_\.\{\}]*/g)
    }
}

// fnOutputs("!p1>$")
// fnOutputs("p2>$" )
// fnOutputs("p3>$param3")
// fnOutputs("p4>${param3}")
// fnOutputs(">$p5.5")
// fnOutputs("gghgh>${p5.6,3,2}mhkj")

// fnOutputs("gghgh>${p5.6,3,2}mhk>${p5.7,3,2}j")

// fnOutputs(">$" )
// fnOutputs("!>$" )
// fnOutputs("p4>${param3}|32")
// fnOutputs("p3>$param3@sdf")
// fnOutputs("p4>$|")

var fnOutputsForKey = (str) =>{
    var iTest = (reg,str,getReg) =>{
        var is = reg.test(str)
        var value = ''
        if(is){
            if(getReg)
                value ='$' + str.match(getReg)
        }
        else 
            return
        console.log(str  + ' : ' + is  + ' : ' + value)
    }
    if(str.indexOf('>$')> -1){
        // "!p1>$"   "p2>$" 
        iTest(/[a-zA-Z0-9_\.]>\$$/,str, /[a-zA-Z0-9_\.]*(?=>\$)/)
        iTest(/.+>\$[a-zA-Z0-9_\.\{\}]*$/,str,/(?<=>\$)[a-zA-Z0-9_\.\{\}]*/g)
    }
}

fnOutputsForKey("!p1>$")
fnOutputsForKey("p2>$" )
fnOutputsForKey("p3>$param3")
fnOutputsForKey("p4>${param3}")
fnOutputsForKey(">$p5.5")
fnOutputsForKey("gghgh>${p5.6,3,2}mhkj")

fnOutputsForKey("gghgh>${p5.6,3,2}mhk>${p5.7,3,2}j")

fnOutputsForKey(">$" )
fnOutputsForKey("!>$" )
fnOutputsForKey("p4>${param3}|32")
fnOutputsForKey("p3>$param3@sdf")
fnOutputsForKey("p4>$|")




