const express = require('express');
const app = express();
const LdapClient = require('../lib/ldap-client');
const cors = require('cors');
const ObjectHelper = require('../lib/object-helper');
const authMiddleware = require('./middleware/auth.middleware');
const Authentication = require('./lib/authentication');
const getUserRoute = require('./routes/user');
const getLoginRoute = require('./routes/login');
const authentication = new Authentication();

ObjectHelper.throwErrorIfPropertiesAreMissingInObject([
    'LDAP_HOST',
    'LDAP_BIND_USERNAME',
    'LDAP_BIND_PASSWORD',
    'LDAP_BASE_USER_DN',
    'EDITABLE_ATTRIBUTES'
], process.env);

const ldapClient = new LdapClient({
    host: process.env.LDAP_HOST,
    bindUsername: process.env.LDAP_BIND_USERNAME,
    bindPassword: process.env.LDAP_BIND_PASSWORD,
    baseUserDn: process.env.LDAP_BASE_USER_DN,
    editableAttributes: process.env.EDITABLE_ATTRIBUTES.split(',')
});

const dependencies = {
    ldapClient,
    authMiddleware,
    authentication
};

app.use(cors());
app.use(express.json());
app.use('/user', getUserRoute(dependencies));
app.use('/login', getLoginRoute(dependencies));

app.listen(3000);