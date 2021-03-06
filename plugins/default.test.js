var plugin = require('./default')


it('default fillNeedsForString', async () =>{
    var context = {
        abc : 13,
        cde : "hello",
        obj : {"hello" : "world"}
    }
    expect(await(plugin.fillNeedsForString('hhhh${abc}jjjj${cde}..',context))).toEqual('hhhh13jjjjhello..')
    expect((await(plugin.fillNeedsForString('$obj',context))).hello).toEqual('world')
})

it('default getRealNeed', async () =>{
    expect(plugin.getRealNeed('${abc}')).toEqual('abc')
    expect(plugin.getRealNeed('$ab')).toEqual('ab')
})