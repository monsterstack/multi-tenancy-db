'use strict';
const config = require('config');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

/**
 * ConnectionPool
 */
class ConnectionPool {
  constructor() {
    this.connectionPool = {
      // Nothing yet.
    };
  }

  /**
   * Generate Model for Tenant
   * @param tenantName {string}
   * @param modelFactory {object}
   * @return models {object}
   * @see mongoose models
   * These models are generated by the provided model factory.
   * Requirements for modelFactory
   * - createModels(connection) method
   */
  generateModelForTenant(tenantName, modelFactory) {
    let myModel = null;
    let tenantNameExists = this.connectionPool.hasOwnProperty(tenantName);

    if (tenantNameExists) {
      myModel = this.connectionPool[tenantName];
    } else {
      // Would like to be able to send an array of replica set members..
      let options = { promiseLibrary: require('bluebird') };
      let connection = mongoose.createConnection(`${config.db.url}/${tenantName}`, options);

      let model = modelFactory.createModels(connection);
      model.connection = connection;
      this.connectionPool[tenantName] = {
        conn: connection,
        model: model,
      };

      /** Clean Up **/
      connection.on('close', () => {
        this._removeConnection(tenantName);
      });

      myModel = this.connectionPool[tenantName];

    }
    return myModel;
  }

  /**
   * Remove Connection
   * @param tenantName {string}
   * @returns {Void}
   */
  _removeConnection(tenantName) {
    delete this.connectionPool[tenantName];
  }
}

// Make this Singleton
const myPool = new ConnectionPool();

// Public
module.exports.createConnection = (tenantName, modelFactory) => {
  return myPool.generateModelForTenant(tenantName, modelFactory);
};
