
var $abc = /^\$[a-zA-Z0-9_\.]*$/
var $kuohao = /\${[a-zA-Z0-9_\.]*}/ig
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
}


test()
console.log("asd${}fsf${abc}asdfasdfsf${cda}asdfasdfsf${ddd}asdf".match($kuohao))
