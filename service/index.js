const express = require('express');
const app = express();
const LdapClient = require('../lib/ldap-client');
const cors = require('cors');
const ObjectHelper = require('../lib/object-helper');
const Authentication = require('./lib/authentication');
const getUserRoute = require('./routes/user');
const getLoginRoute = require('./routes/login');
const getAuthMiddleware = require('./middleware/auth.middleware')
const authentication = new Authentication();

ObjectHelper.throwErrorIfPropertiesAreMissingInObject([
    'LDAP_HOST',
    'LDAP_BIND_DN',
    'LDAP_BIND_PASSWORD',
    'LDAP_BASE_USER_DN',
    'EDITABLE_ATTRIBUTES'
], process.env);

const ldapClient = new LdapClient({
    host: process.env.LDAP_HOST,
    port: process.env.LDAP_PORT || 389,
    bindUsername: process.env.LDAP_BIND_DN,
    bindPassword: process.env.LDAP_BIND_PASSWORD,
    baseUserDn: process.env.LDAP_BASE_USER_DN,
    editableAttributes: process.env.EDITABLE_ATTRIBUTES.split(',')
});

const dependencies = {
    ldapClient,
    authentication
};

dependencies.authMiddleware = getAuthMiddleware(dependencies);;

app.use(cors());
app.use(express.json());
app.use('/user', getUserRoute(dependencies));
app.use('/login', getLoginRoute(dependencies));

app.listen(process.env.PORT || 3000);
