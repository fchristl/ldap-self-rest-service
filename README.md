This is a simple express-based REST service to allow self-service functionality
for users on an LDAP server.

For example, if a user wants to change their given name in an LDAP directory, it could
be achieved with a `PUT /user`.

## Basics

### Connecting to the LDAP server
When starting the service, it opens a connection to the LDAP server. The LDAP server used
is defined in the environment variable `LDAP_HOST`, e.g. `LDAP_HOST=localhost:389`. If
the port is omitted, 389 is assumed.

### LDAP Binding
It then binds
to the LDAP server using the bind user data supplied.

The bound user needs to have admin privileges on all other users. It is used to perform
any action on the LDAP server, such as querying a user and modifying a user.

The bound user is defined with `LDAP_BIND_DN` and needs to be a fully qualified DN.
For example, in a new OpenLDAP instance: `LDAP_BIND_DN=cn=admin,dc=example,dc=org`.

The bound user's password is defined in `LDAP_BIND_PASSWORD`, for example: 
`LDAP_BIND_PASSWORD=admin`.

### Authenticating Individual Users
In order to authenticate individual users (and therefore make sure they are allowed to
edit their LDAP entry), the individual user's username and password are verified against
LDAP. To do that, a separate LDAP connection is opened and the user's credentials are used
to BIND to make sure the user is allowed to login. After that, the user is unbound right
away and the connection is closed.

To find a user, the service looks in the subtree of `LDAP_BASE_USER_DN`. For eample:
`LDAP_USER_DN=ou=users,dc=example,dc=org`.

It is assumed that a user whose credentials were verified is allowed to edit all
permitted LDAP attributes.

### Editing A User Entry
Once a user is authenticated, they can change their LDAP attributes. However, not all
attributes should be changeable by a user. This service therefore uses a whitelist that
contains the editable attributes: `EDITABLE_ATTRIBUTES=givenName,sn` for letting
a user edit their first and last name.

## Running the Service
To start the service, install this NPM package:

    npm install ldap-self-service

Then start the service:

    LDAP_HOST=localhost \
    LDAP_BIND_DN=cn=admin,dc=example,dc=org \
    LDAP_BIND_PASSWORD=admin \
    LDAP_BASE_USER_DN=cn=users,dc=example,dc=org \
    EDITABLE_ATTRIBUTES=givenName,sn \
    PORT=3000 \
    node ./node_modules/.bin/ldap-self-service
    
It will, by default, run on PORT 3000. That can be changed using the `PORT` environment
variable. 
   
## Environment Variables for Configuration
To summarize, here are the environment variables used for configuration:

* `LDAP_HOST`: The LDAP host to connect to, e.g. `LDAP_HOST=localhost:389`
* `LDAP_BIND_DN`: The DN of the user who's used to perform for all edit and 
   lookup operations.
* `LDAP_BIND_PASSWORD`: The password for that user.
* `LDAP_BASE_USER_DN`: The base DN that all editable users are found under. 
   E.g. `LDAP_BASE_USER_DN=ou=users,dc=example,dc=org`.
* `EDITABLE_ATTRIBUTES`: A comma-separated list of attributes individual users
  can edit (e.g. `EDITABLE_ATTRIBUTES=givenName,sn`).
* `PORT`: Port under which this service is reachable.
  
