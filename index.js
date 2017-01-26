'use strict';
const config = require('config');
const connectionPool = require('./libs/connectionPool');

// Public
module.exports.createConnection = connectionPool.createConnection;
