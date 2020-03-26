exports.testReturnJson = {
    "@get" : (params)=>{
        return {
            value : "it is a json Value"
        }
    }
}
exports.testReturnString = {
    "@get" : "here is string return value"
}

exports.testMethods ={
    "@get" :  {
        success : true,
        msg : "it is get"
    },
    "@post" : {
        success : true,
        msg : "it is post"
    },
    "@put" : {
        success : true,
        msg : "it is put"
    },
    "@delete" : {
        success : true,
        msg : "it is delete"
    }
}