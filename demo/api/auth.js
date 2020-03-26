
global.tokens = global.tokens || []

exports.tokens = () => {
    return global.tokens
}

exports.login = {
    "@post": (params) => {
        if (params.username
            && params.pwd
            && params.username == 'apporoad'
            && params.pwd == '123456') {

            var $token = new Date().getTime()
            global.tokens.push($token)
            return {
                success: true,
                msg: 'login successed',
                token: $token
            }
        } else {
            return {
                success: false,
                msg: 'something wrong'
            }
        }
    }
}