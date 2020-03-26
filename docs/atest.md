## atest
即meta数据

### 标准格式

atest.js  or atest.json
```js
 {
        url : "http://localhost:11540/${abc}/",
        method : 'get',  //默认值 default value
        name : "demoApi",
        baseUrl : 'http://localhost:11540'       
}

```

or

```
module.exports = async (context,options)=>{
        return {}
}

```

### 加载顺序

```
.
├── 1.api
│   ├── atest.js
│   ├── case001
│   │   ├── atest.json
│   │   └── req.js
│   ├── req.js
│   └── res.js
├── 2.api
│   ├── req.js
│   └── res.js
├── api
│   ├── auth.js
│   ├── easy.js
│   └── real.js
├── atest.json
```
优先级排序为：
```js
require('./1.api/case001/req.js').meta   >  require('./1.api/case001/atest.json') > require('./1.api/atest.js') > require('./atest.json')

```