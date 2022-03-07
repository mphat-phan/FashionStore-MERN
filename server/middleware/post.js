const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req,res,next) => {
    const AuthHeader = req.header('Authorization');
    const token = AuthHeader && AuthHeader.split(' ')[1];
    if(!token){
        return res
        .status(401)
        .json({
            success: false,
            message: 'Access token not found',
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.userID = decoded.userID;
        next(); 
        
    } catch (error) {
        console.log(error);
        return res
        .status(402)
        .json({
            success: false,
            message: 'Invalid token',
        })
    }
}

module.exports = verifyToken