module.exports = function(context){

    var index = context.$index  || 1
    context.set("$index" , index++)
    
    return Promise.resolve({
        p1: "asdfsdf",
        p2: function (ctt){
            return new Promise((r)=>{
                r('abc')
            })
        },
        p3 : index
    })    
}