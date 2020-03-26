var cm = require('../modules/contextMan')

cm.set({
    abc : "abc",
    test : true,
    $abc : {
        hello : "world"
    }
},__dirname)

//一秒就超时
console.log(cm.get(__dirname,{timeOut:1}))


