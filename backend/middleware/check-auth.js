//1 is token attached
//2 is token valid 
const jwt = require('jsonwebtoken');

//middleware attached to a function
module.exports = (req, res, next) => {
    try { 
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
        req.userData = { email : decodedToken.email, userId: decodedToken.userId };
        next();
    } catch(error) {
        res.status(401).json({ message: "Auth failed"});
    }
};