const jwt = require('jsonwebtoken')


const verifyJWT = (req, res, next) => {
    //check if the request has an header
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader) res.sendStatus(401) // no authorization header

    //removing the token from the authrization header
    const token = authHeader.split(' ')[1]

    //verify token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY,
        (err, decoded) => {
            if(err) res.sendStatus(403) //Invalid token
            req.user = decoded.username
            next()
        }
    )
}

module.exports = verifyJWT