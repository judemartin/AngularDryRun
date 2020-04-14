//1 is token attached
//2 is token valid 
const jwt = require('jsonwebtoken');

//middleware attached to a function
module.exports = (req, res, next) => {
    try { 
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, "secret_this_should_be_longer");
        next();
    } catch(error) {
        res.status(401).json({ message: "Auth failed"});
    }
};