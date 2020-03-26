var atestUtil = require('../modules/atestUtil')
var context = {
  hello : 'LiSA',
  jiayou :'china'
}
var json = {
  name : {
    hello : "$jiayou",
    stars : [
      {
        look : '@ ${hello}',
        fuck :'${you}'
      }
    ]
  }
}

 atestUtil.fillReq(json,context).then(d=>{
    console.log(d.name.stars)
})
