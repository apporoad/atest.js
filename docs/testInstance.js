

module.exports = {
    id : 'xx',  //唯一标识，根据instance 相对路径生成
    path :'文件苏偶在位置',
    meta : {
        url : "",
        baseUrl : ""
    },
    upperMetas :[],  
    //翻译后的meta
    realMeta : {},
    req : {
        meta : {},   //翻译后不起效果
        headers : {},
        method : "get",
        data : {

        }
    },
    // 翻译后的对象
    realReq :{},
    // resSchema : new Promise()  or function   
    // 如何resSchema是函数， 在预判结果时，因为没有实际调用接口，采用历史值，没有历史值，采用空值
    res:{
    },
   //翻译后的对象
    realRes : []
}