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
    let myModel = null;
    let tenantNameExists = this.connectionPool.hasOwnProperty(tenantName);

    if(tenantNameExists) {
      myModle = this.connectionPool[tenantName].model;
    } else {
      // Would like to be able to send an array of replica set members..
      let connection = mongoose.createConnection(`${config.db.url}/${tenantName}`);

      let model = modelFactory.createModels(connection);
      model.connection = connection;
      this.connectionPool[tenantName] = {
        conn: connection,
        model: model
      };

      /** Clean Up **/
      connection.on('close', () => { this._removeConnection(tenantName) });

      myModel = this.connectionPool[tenantName];

      return myModel;
    }
  }

  _removeConnection(tenantName) {
    delete this.connectionPool[tenantName];
  }
}

// Make this Singleton
const myPool = new ConnectionPool();

module.exports.createConnection = (tenantName, modelFactory) => {
  return myPool.generateModelForTenant(tenantName, modelFactory);
}
