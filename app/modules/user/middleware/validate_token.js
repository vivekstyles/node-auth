const jwt = require('jsonwebtoken');

const middlewareForTokenValidate = (req,res,next,secret) => {
    

    try {
        var tokenTrim = req.headers.authorization.split(" ")
        
        const decoded = jwt.verify(`${tokenTrim[1]}`,secret,{
            algorithms : ['HS256'],
        })
        console.log(decoded)
            next()   
        
    } catch (error) {
        console.log('Error through',error.name)
        if (error.name == 'JsonWebTokenError') {
            return res.redirect('/user/tokenInvalid')
            
        }else if(error.name == 'TokenExpiredError'){
            res.redirect('/user/tokenEx')
        }else{
            return res.redirect('/user/tokenInvalid')
        }
    }
} 

module.exports = middlewareForTokenValidate