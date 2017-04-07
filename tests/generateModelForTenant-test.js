'use strict';
const mongoose = require('mongoose');
const assert = require('assert');
const multiTenancy = require('../index');

/**
 * ModelFactory for Test Case
 */
class ModelFactory {

  createModels(connection) {
    let User = connection.model('User', mongoose.Schema({
      name: String,
    }));

    return {
      User: User,
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
  it('shall generate a db for tenant fred', (done) => {
    let model = multiTenancy.findOrCreateNewConnection('fred', new ModelFactory()).model;
    assert(model != null, "Model is not null");
    let carlos = new model.User({name: "carlos"});
    carlos.save((err, doc) => {
      if (err) {
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
  it('shall generate a db for tenant wilber', (done) => {
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
  it('shall generage a db for tenant jorge', (done) => {
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

  it('shall generage multiple non-null dbs for tenant carlos', (done) => {
    let modelOne = multiTenancy.findOrCreateNewConnection('carlos', new ModelFactory()).model;
    let modelTwo = multiTenancy.findOrCreateNewConnection('carlos', new ModelFactory()).model;
    let modelThree = multiTenancy.findOrCreateNewConnection('carlos', new ModelFactory()).model;

    if(modelOne !== null && modelTwo != null && modelThree != null) {
      done();
    } else {
      done(new Error('Expected 3 non-null dbs'));
    }
  });

  /**
   * Cleanup
   * @param done {Function}
   * @returns {Error}
   */
  after((done) => {
    done();
  });
});
