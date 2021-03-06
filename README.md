# node-red-auth-pam

Provides an authentication mechanism for NodeRED based on PAM on Linux


## Installing

This requires authenitcate-pam, that requires PAM headers for compilation. Install the package `libpam0g-dev` with your favorite package manager. On Debian-based distros:

     sudo apt-get install libpam0g-dev

Then install this package on the folder your `settings.js` is located, typically `~/.node-red`, by running

     npm install node-red-auth-pam


## Usage

Just require the module and call the returning function, setting the result to `adminAuth`, as the example below:

    // ...
    //    }]
    //},
    adminAuth: require('node-red-auth-pam')(),

    // To password protect the node-defined HTTP endpoints (httpNodeRoot), or
    // the static content (httpStatic), the following properties can be used.
    // ...


## Limitations

 - All authenticated users have full access, i.e. no permissions control


## Bugs and enhancements

Please open an issue on the [page of the project on GitHub](https://github.com/netsmarttech/node-red-auth-pam), or reach out on the [Node-RED forum](https://discourse.nodered.org/).


## License

Copyright 2017-2020 Smart-Tech, [Apache 2.0 license](LICENSE).