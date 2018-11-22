const ldap = require('ldapjs');
const ObjectHelper = require('./object-helper');

class LdapClient {

    constructor(params) {
        ObjectHelper.throwErrorIfPropertiesAreMissingInObject(
            ['host', 'bindUsername', 'bindPassword', 'baseUserDn'],
            params);
        if (params.editableAttributes == null) {
            params.editableAttributes = ['sn', 'givenName', 'mobile'];
        }
        this.params = params;
        this.client = null;
    }

    ensureConnection() {
        if (this.client == null || !this.client.connected) {
            this.connect();
        }
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.client = this.getClient();
            this.client.bind(this.params.bindUsername, this.params.bindPassword, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    disconnect() {
        this.client.unbind();
    }

    getClient() {
        return ldap.createClient({
            url: `ldap://${this.params.host}:${this.params.port || 389}`
        });
    }

    getUser(userDn) {
        return new Promise((resolve, reject) => {
            if (userDn == null || userDn === '') {
                return reject('No user DN given');
            }

            this.ensureConnection();

            userDn = this.sanitizeUserDn(userDn);

            this.client.search(userDn, {scope: 'base'}, (err, res) => {
                if (err) {
                    reject(err);
                }
                const entries = [];
                res.on('searchEntry', (entry) => {
                    entries.push(entry.object);
                });
                res.on('error', (err) => {
                    reject(err);
                });
                res.on('end', () => {
                    if (entries.length > 0) {
                        return resolve(entries[0]);
                    }
                    resolve([]);
                });
            });
        });
    }

    setUserAttribute(userDn, attribute, value)  {
        return new Promise((resolve, reject) => {

            if (userDn == null || userDn === '') {
                return reject('No user DN given');
            }
            if (this.params.editableAttributes.indexOf(attribute) === -1) {
                return reject(`Trying to edit an attribute that is not allowed: ${attribute}`);
            }

            this.ensureConnection();
            userDn = this.sanitizeUserDn(userDn);

            const modification = {};
            modification[attribute] = [value];
            const change = new ldap.Change({
                operation: 'replace',
                modification: modification
            });
            this.client.modify(userDn, change, (err) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                resolve();
            });
        });
    }

    checkPassword(userDn, password) {
        return new Promise((resolve, reject) => {
            if (userDn == null || userDn === '') {
                return reject('No user DN given');
            }

            if (password == null || password === '') {
                return reject('No password given');
            }

            this.ensureConnection();

            userDn = this.sanitizeUserDn(userDn);


            const tempClient = this.getClient();
            tempClient.bind(userDn, password, (err) => {
                resolve(!!!err);
                tempClient.unbind();
            })
        });
    }

    sanitizeUserDn(username) {
        if (username.indexOf(this.params.baseUserDn) === -1) {
            username = `cn=${username},${this.params.baseUserDn}`
        }
        return username;
    }




}
module.exports = LdapClient;