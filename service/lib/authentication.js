const jwt = require('jsonwebtoken');
const randomString = require('randomstring');

class Authentication {
    constructor() {
        this.secret = randomString.generate();
    }

    sign(object) {
        return new Promise((resolve, reject) => {
            jwt.sign(object, this.secret, {expiresIn: '1 hour'}, (err, token) => {
                if (err) {
                    return reject(err);
                }
                resolve(token);
            })
        });
    }

    verify(token) {
        return new Promise((resolve, reject) => {
            if (!token) {
                return reject('No token');
            }
            return jwt.verify(token, this.secret, (err, decoded) => {
                if (err) {
                    return reject(err.message);
                }
                resolve(decoded);
            })
        });
    }

}
module.exports = Authentication;