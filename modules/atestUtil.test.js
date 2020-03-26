var atestUtil = require('./atestUtil')
var context = {
  hello : 'LiSA',
  jiayou :'china'
}
var json = {
  name : {
    hello : "$jiayou",
    stars : [
      {
        look : '@ ${hello}'
      }
    ]
  }
}

it('test atestUtil fillReq',async ()=>{
  expect((await atestUtil.fillReq(json,context)).name.hello).toBe('china')
})