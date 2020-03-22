


var  fn1 = async ()=>{
    throw new Error('')
}

var fn2 = ()=>{
    asf -sdf 
}


var test =async()=>{
    try{
        await fn1()
    }catch(ex){
        console.log('catched1')
    }

    try{
        fn2()
    }catch(e){
        console.log('catched2')
    }


}


test()