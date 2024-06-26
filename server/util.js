const crypto = require('crypto');
const util = require("util");

util.generateUID = () =>
    "NSS_" + Date.now() + "_" + crypto.randomBytes(16).toString('base64')

util.getUIDStamp = ( uid ) => uid.split( "_" )[1] ;

module.exports = util ;