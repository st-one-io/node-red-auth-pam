'use strict';

var when = require('when');
var util = require('util');
var pam = require('authenticate-pam');

var usersMap = new Map();

module.exports = function (opts) {
    //opts not used now, but allows future expansions/configurations
    return {
        type: "credentials",
        users: function (username) {
            return when.promise(function (resolve, reject) {
                resolve(usersMap.get(username) || null);
            });
        },
        authenticate: function (username, password) {
            return when.promise(function (resolve, reject) {

                pam.authenticate(username, password, function (err) {
                    if (err) {
                        util.log(`UserAuth - authenticate - ${username} not authenticated - ${err}`);
                        usersMap.delete(username);
                        resolve(null)
                    } else {
                        let user = {
                            username: username,
                            permissions: "*"
                        }
                        util.log(`UserAuth - authenticate - ${JSON.stringify(user)}`);
                        usersMap.set(username, user);
                        resolve(user);
                    }
                }, {
                    serviceName: 'node-red',
                    remoteHost: 'localhost'
                });

            });
        },
        default: function () {
            return when.promise(function (resolve) {
                // Resolve with the user object for the default user.
                // If no default user exists, resolve with null.
                /*resolve({
                    anonymous: true,
                    permissions: "read"
                });*/
                resolve(null);
            });
        }
    }
}