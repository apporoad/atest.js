var atestUtil = require('./atestUtil')




it('test atestUtil fillReq', async () => {
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

it('test atestUtil feedContext', async () => {
  var context ={}
  var res ={
    success : "!",
    data1 : {
        "!p1>$" : null,
        p2 : "![1,100]",
        "p3>$param3" : "asdfsdf>${pp3}",
        p4 : "!=${abc}",
        "p${p1}5" : ($) => { return true},
        "$p3" : ($) => { return true},
        "p5.5" : ">$p5.5",
        "p5.6" : "ggh>${}hh=>${p5.6}mh>${p5.7}kjaaaaaaaaaaaaaaaa>${p5.8}cccccccc",
        p6 : "!!",
        "!p7" :  {
            p71 : "!",
            p72 : "!>12",
            p73 : "!=^.rp2"
        },
        's7' : [ 'ggh${}gh>${s7}mh>${s8}kj'],
        "p7.5" : "!=$.p4",
        p9 : /ab*/g,
        p8 : [{
            "!a" : "![1,100]" 
        }],
        p10 : $=>{
            return {
                success : true,
                remark : 'good job'
            }
        },
        p11 : (res,context,options)=>{
            console.log(context)
            console.log(res)
            console.log( options.req)
            return new Promise((r,j)=>{
                setTimeout(()=>{
                    r(true)
                },500)
            })
        },
        p12 : new Promise((r,j)=>{
            r(true)
        }),
        p13 : async ()=>{
            return true
        }
    }
  }
  var resData = {
    success : "!",
    data1 : {
        "p1" : 'here is p1',
        p2 :  99 ,
        "p3" : 33,
        p4 : ' here is p4',
        "p${p1}5" : true,
        "$p3" : true,
        "p5.5" : " here is p5.5",
        "p5.6" : "gghccchh=abcdefgmhaaaaaaakj",
        p6 : "abc",
        "p7" :  {
            p71 : 2,
            p72 : 32,
            p73 : 21
        },
        "s7" :[ 'hello'],
        "p7.5" : 56,
        p9 : /ab*/g,
        p8 : [{
            "a" : 99
        }],
        p10 : $=>{
            return {
                success : true,
                remark : 'good job'
            }
        },
        p11 : (res,context,options)=>{
            console.log(context)
            console.log(res)
            console.log( options.req)
            return new Promise((r,j)=>{
                setTimeout(()=>{
                    r(true)
                },500)
            })
        },
        p12 : new Promise((r,j)=>{
            r(true)
        }),
        p13 : async ()=>{
            return true
        }
    }
  }
  
  await atestUtil.feedContext(context,'ccc=hello&ddd=world&eeee','ccc=>${abc}&ddd=>${dd}&eeee')
  expect(context.abc).toBe('hello')
  expect(context.dd).toBe('world')

  await atestUtil.feedContext(context,resData,res)

  expect(context.p1).toBe('here is p1')
  expect(context['p5.5']).toBe(' here is p5.5')
  expect(context.param3).toBe(33)
  expect(context['p5.6']).toBe("abcdefg")

})
  

