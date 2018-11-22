function getAuthMiddleware(dependencies) {
     return async (req, res, next) => {
        try {
            res.locals.user = await dependencies.authentication.verify(req.get('Authorization').toString());
            return next();
        } catch (err) {
            return res.status(401).send(err);
        }
    };
}
module.exports = getAuthMiddleware;