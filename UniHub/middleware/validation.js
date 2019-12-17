const validator = require("validator");

const validation = (req, res, next) => {

    if (req.body.email && !validator.isEmail(req.body.email))
        return res.status(400).send({ msg: "Please enter a valid e-mail." });

    if (req.body.telephone && !validator.isInt(req.body.telephone))
        return res.status(400).send({ msg: "Please enter a valid telephone number." });

    if (req.body.password && (req.body.password !== req.body.confirmPassword))
        return res.status(400).send({ msg: "Passwords does not match each other." });

    next();

};

module.exports = validation;