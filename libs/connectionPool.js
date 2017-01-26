'use strict';
const config = require('config');
const mongoose = require('mongoose');

class ConnectionPool {
  constructor() {
    this.connectionPool = {
      // Nothing yet.
    };
  }


  generateModelForTenant(tenantName, modelFactory) {
    if(this.connectionPool.hasOwnProperty(tenantName)) {
      return this.connectionPool[tenantName].model;
    } else {
      // Would like to be able to send an array of replica set members..
      let connection = mongoose.createConnection(`mongodb://${config.db.host}:${config.db.port}/${tenantName}`);

      let model = modelFactory(connection);
      model.connection = connection;
      this.connectionPool[tenantName] = {
        conn: connection,
        model: model
      };

      /** Clean Up **/
      connection.on('close', () => {
        console.log('deleting connection');
        delete this.connectionPool[tenantName];
      });

      return this.connectionPool[tenantName];
    }
  }
}

// Make this Singleton
const myPool = new ConnectionPool();

module.exports.createConnection = (tenantName, modelFactory) => {
  return myPool.generateModelForTenant(tenantName, modelFactory);
}
