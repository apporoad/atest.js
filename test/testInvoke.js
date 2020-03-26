
var invoker = require('../modules/invoker')

// aok demo/api/
var baseUrl = "http://localhost:11540/"

invoker.req('post',baseUrl + 'auth/login',{
    username: 'apporoad',pwd:'123456'
}).then(d=>{
    //    console.log(d.body)
    if(d.body&& d.body.success){
        console.log(d.body.token)
        invoker.req('get',baseUrl + 'auth/tokens').then(r=>{
            console.log(r.body)
        })
    }
    //console.log(d.bod
})