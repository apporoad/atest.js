

module.exports = {
    id : 'xx',  //唯一标识，根据instance 相对路径生成
    meta : {
        url : ""
    },
    req : {
        meta : {},
        headers : {},
        method : "get",
        data : {

        }
    },
    // resSchema : new Promise()  or function   
    // 如何resSchema是函数， 在预判结果时，因为没有实际调用接口，采用历史值，没有历史值，采用空值
    res:{
    }
}