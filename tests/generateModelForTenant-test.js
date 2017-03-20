'use strict';
const mongoose = require('mongoose');
const assert = require('assert');
const multiTenancy = require('../index');

/**
 * ModelFactory for Test Case
 */
class ModelFactory {
  constructor() {
  }

  createModels(connection) {
    let User = connection.model('User', mongoose.Schema({
      name: String
    }));

    return {
      User: User
    };
  }
}

/**
 * Discovery model
 * Find service
 * 
 * @returns {Void}
 */
describe('discovery-proxy', () => {
  /**
   * Setup
   * @param done {Function}
   * @returns {Error}
   */
  before((done) => {
    done();
  });

  /**
   * Test that model is generated
   * @param done {Function}
   * @returns {Error}
   */
  it('model is generated for tenant fred', (done) => {
    let model = multiTenancy.findOrCreateNewConnection('fred', new ModelFactory()).model;
    assert(model != null, "Model is not null");
    let carlos = new model.User({name: "carlos"});
    carlos.save((err, doc) => {
      if(err) {
        assert(err != null, "No error occurs");
      } else {
        assert(doc != null, "Save occured");
      }
      model.connection.dropDatabase();
      done();
    });
  });

  /**
   * Test that model is generated
   * @param done {Function}
   * 
   * @returns {Error}
   */
  it('model is generated for tenant wilber', (done) => {
    let model = multiTenancy.findOrCreateNewConnection('wilber', new ModelFactory()).model;
    assert(model != null, "Mode is not null");
    let carlos = new model.User({name: "carlos"});
    carlos.save((err, doc) => {
      if(err) {
        assert(err != null, "No error occurs");
      } else {
        assert(doc != null, "Save occured");
      }

      model.connection.dropDatabase();
      done();
    });
  });

  /**
   * Test that model is generated
   * @param done {Function}
   * 
   * @returns {Error}
   */
  it('model is generated for tenant jorge', (done) => {
    let model = multiTenancy.findOrCreateNewConnection('jorge', new ModelFactory()).model;
    assert(model != null, "Mode is not null");
    let carlos = new model.User({name: "carlos"});
    carlos.save((err, doc) => {
      if(err) {
        assert(err != null, "No error occurs");
      } else {
        assert(doc != null, "Save occured");
      }
      model.connection.dropDatabase();
      done();
    });
  });

  /**
   * Cleanup
   * @returns {Void}
   */
  after(() => {

  });
});
