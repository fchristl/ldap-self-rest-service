const express = require('express');

function getUserRoute(dependencies) {
    const router = express.Router();

    router.get('/', dependencies.authMiddleware, async (req, res) => {
        res.send(await dependencies.ldapClient.getUser(res.locals.user.username))
    });
    router.put('/', dependencies.authMiddleware, async (req, res) => {
        const newUser = req.body;
        const oldUser = await dependencies.ldapClient.getUser(res.locals.user.username);
        for (let key in newUser) {
            if (JSON.stringify(oldUser[key]) !== JSON.stringify(newUser[key])) {
                try {
                    await dependencies.ldapClient.setUserAttribute(res.locals.user.username, key, newUser[key]);
                } catch (err) {
                    return res.status(400).send(err);
                }
            }
        }
        res.status(200).send(await dependencies.ldapClient.getUser(res.locals.user.username));
    });

    return router;
}

module.exports = getUserRoute;