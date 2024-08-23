const jwt = require('jsonwebtoken');

const verifyToken = async(req, res, next) => {
    const token = req.header('Authorization');
    if(!token) return res.status(401).send({ 'error': 'Access denied. No token provided' });

    try {
        const decoded = jwt.verify(token, "2005")
        req.user = decoded.user;
        next();
        
    } catch (error) {
        return res.send({ 'error': error.message}).status(500);
    }
}

module.exports = {
    verifyToken
}