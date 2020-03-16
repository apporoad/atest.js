## req
sort for request   
请求对象，对请求的封装

### standard req (标准完整)

```js
{
    meta : {
        id : "atest.js_demo_case001",
        url : "http://localhost:11540/$abc/",
        name : "demoApi"
    },
    headers : {
        token : 'Bearer 255ffaf8-9c6d-4bbb-8719-a8a0f7e28412',
        Cookie : "",
    },
    data : {
        "param1": "$p1",
        "$p2" : 12,
        "param2" : 100,
        "param3" : context =>{
            return 'hello good good day'
        }
        "param4": context=>{
            return new Promise((r)=>{r(1)})
        }
    }
}
```
当然可以只有 data:
```js
{
    "param1": "$p1",
    "$p2" : 12,
    "param2" : 100,
    "param3" : context =>{
        return 'hello good good day'
    }
    "param4": context=>{
        return new Promise((r)=>{r(1)})
    }
}
```


### json方式
req.json  or request.json
```json
{
    "param1": "$p1",
    "$p2" : 12,
    "param2" : 100
}
```
or
```json
{
    "meta" : {
        "id" : "atest.js_demo_case001",
        "url" : "http://localhost:11540/$abc/",
        "name" : "demoApi"
    },
    "headers" : {
        "token" : "Bearer 255ffaf8-9c6d-4bbb-8719-a8a0f7e28412",
        "Cookie" : "",
    },
    "data" : {
        "param1": "$p1",
        "$p2" : 12,
        "param2" : 100
    }
}

```
data非json格式
```JSON
{
    "meta" : {
        "id" : "atest.js_demo_case001",
        "url" : "http://localhost:11540/$abc/",
        "name" : "demoApi"
    },
    "headers" : {
        "token" : "Bearer 255ffaf8-9c6d-4bbb-8719-a8a0f7e28412",
        "Cookie" : "",
    },
    "data" : "username=xiaoming&password=$abc"
}
```


### 函数模式
req.js or request.js  

直接导出json
```js
module.exports ={
    meta : {
        id : "atest.js_demo_case001",
        url : "http://localhost:11540/$abc/",
        name : "demoApi"
    },
    headers : {
        token : 'Bearer 255ffaf8-9c6d-4bbb-8719-a8a0f7e28412',
        Cookie : "",
    },
    data : {
        "param1": "$p1",
        "$p2" : 12,
        "param2" : 100,
        "param3" : context =>{
            return 'hello good good day'
        }
        "param4": context=>{
            return new Promise((r)=>{r(1)})
        }
    }
}
```
```js
module.exports ={
        "param1": "$p1",
        "$p2" : 12,
        "param2" : 100,
        "param3" : context =>{
            return 'hello good good day'
        }
        "param4": context=>{
            return new Promise((r)=>{r(1)})
        }
}
```
函数
```js
module.exports = (context, invokeChain) => {
    //do something
    console.log(context)
    return {
        meta : {},
        headers : {},
        data : {}
        }
    }
}
```
promise情况
```js
module.exports = new Promise((r,j)=>{
    r({
        "param1": "$p1",
        "$p2" : 12,
        "param2" : 100,
        "param3" : context =>{
            return 'hello good good day'
        }
        "param4": context=>{
            return new Promise((r)=>{r(1)})
        }
    })
})
```
返回promise情况
```js
module.exports = () => {
    return new Promise((r,j)=>{
        r({
            ...
        })
    })
}
```
异步函数
```js
module.exports = async ()=>{
    return {
        ...
    }
}
```