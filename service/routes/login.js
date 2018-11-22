const express = require('express');

function getLoginRoute(dependencies) {
    const router = express.Router();
    router.post('/', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const isOk = await dependencies.ldapClient.checkPassword(username, password);
        if (isOk) {
            res.send({'token': await dependencies.authentication.sign({username: username})})
        } else {
            res.status(401).send();
        }
    });
    return router;
}

module.exports = getLoginRoute;