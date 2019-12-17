const jwt = require("jsonwebtoken");

const jwtSecret = require("../config/keys").jwtSecret;

const authenticationAdmin = (req, res, next) => {
    const token = req.header('x-authorize-token');
    const type = req.header('x-authorize-type');

    if (type !== "admin")
        return res.status(401).send({msg: 'Authorization denied.'});

    //Checking whether there is a token in the request.
    if(!token) return res.status(401).send({msg: 'Authorization denied.'});

    //Checking validity of the token.
    try {
        req.body.decoded = jwt.verify(token, jwtSecret);
        next();
    } catch (e) {
        res.status(400).send({msg: 'Invalid token.'})
    }
};

module.exports = authenticationAdmin;