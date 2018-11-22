const Authentication = require('../lib/authentication');
const authentication = new Authentication();

module.exports = async (req, res, next) => {
    try {
        res.locals.user = await authentication.verify(req.get('Authorization').toString());
        return next();
    } catch (err) {
        return res.status(401).send(err);
    }
};