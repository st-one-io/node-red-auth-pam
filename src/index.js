//@ts-check
/*
   Copyright 2017-2020 Smart-Tech

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

//@ts-ignore
const pam = require('authenticate-pam');
const util = require('util');

const usersMap = new Map();
const _authenticate = (u, p) => new Promise(res => {
    pam.authenticate(u, p, err => res(err), { serviceName: 'node-red', remoteHost: 'localhost' });
});

module.exports = function (opts = { users: [] }) {
    //opts used for username to permission mapping
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
                let user = opts.users.find(e => e.username === username);
				if (user === undefined) {
	                util.log(`UserAuth - authenticate - ${username}  authenticated, but no permissions`);
					usersMap.delete(username);
					return null;
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