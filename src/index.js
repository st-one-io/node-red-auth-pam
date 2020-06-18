//@ts-check

//@ts-ignore
const pam = require('authenticate-pam');
const util = require('util');

const usersMap = new Map();
const _authenticate = (u, p) => new Promise(res => {
    pam.authenticate(u, p, err => res(err), { serviceName: 'node-red', remoteHost: 'localhost' });
});

module.exports = function (opts = {}) {
    //opts not used now, but allows future expansions/configurations
    return {
        type: "credentials",
        async users(username) {
            return usersMap.get(username) || null;
        },
        async authenticate(username, password) {

            let err = await _authenticate(username, password);
            if (err) {
                util.log(`UserAuth - authenticate - ${username} not authenticated - ${err}`);
                usersMap.delete(username);
                return null;
            } else {
                let user = {
                    username: username,
                    permissions: "*"
                }
                util.log(`UserAuth - authenticate - ${JSON.stringify(user)}`);
                usersMap.set(username, user);
                return user;
            }
        },
        async default() {
            // Resolve with the user object for the default user.
            // If no default user exists, resolve with null.
            return null;
        }
    }
}