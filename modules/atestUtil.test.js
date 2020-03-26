var atestUtil = require('./atestUtil')
var context = {
  hello: 'LiSA',
  jiayou: 'china'
}
var json = {
  name: {
    hello: "$jiayou",
    stars: [
      {
        look: '@ ${hello}'
      }
    ]
  }
}

// atestUtil.getReqNeeds({
//   'abcd': '$abc',
//   '$ccd': '${a}',
//   abc: {
//     hello: 'asdfsdf$asf${c} ,  ${d}'
//   }
// }).then(d => { console.log(d) })


var test = () => {
  it('test atestUtil fillReq', async () => {
    expect((await atestUtil.fillReq(json, context)).name.hello).toBe('china')
  })



  it('test atestUtil getReqNeeds', async () => {

    expect((await atestUtil.getReqNeeds('$ab'))[0]).toBe('$ab')
    expect((await atestUtil.getReqNeeds('asfdf$as${abc}'))[0]).toBe('${abc}')

    expect((await atestUtil.getReqNeeds({
      'abcd': '$abc',
      '$ccd': '${a}',
      abc: {
        hello: 'asdfsdf$asf${c} ,  ${d}'
      }
    })).length).toBe(5)

  })


    it('test atestUtil getResNeeds', async () => {

    expect((await atestUtil.getResNeeds('$ab'))[0]).toBe('$ab')
    expect((await atestUtil.getResNeeds('asfdf$as${abc}'))[0]).toBe('${abc}')

    expect((await atestUtil.getResNeeds({
      'abcd': '$abc',
      '$ccd': '${a}',
      abc: {
        hello: 'asdfsdf$asf${c} ,  ${d}'
      }
    })).length).toBe(5)

  })


    it('test atestUtil getResOutputs', async () => {

    expect((await atestUtil.getResOutputs('>$ab'))[0]).toBe('$ab')
    expect((await atestUtil.getResOutputs('asfdf$as>${abc}'))[0]).toBe('${abc}')

    expect((await atestUtil.getResOutputs({
      'abcd': '>$abc',
      'ccd>$': 'asdf',
      'ccds>$aa': '${a}',
      abc: {
        hello: 'asdfsdf$asf>${c} ,  ${d}'
      }
    })).length).toBe(4)

  })


}


test()