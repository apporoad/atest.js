


module.exports = {
    meta : {},
    headers : {},
    data : {
        "rp1": "$ccc",
        "$aaa" : 12,
        "rp2" : 100,
        "rp3" : function(data){
            return data.rp2
        }
    }
}

