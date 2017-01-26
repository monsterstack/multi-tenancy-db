'use strict';
const mongoose = require('mongoose');
const assert = require('assert');
const multiTenancy = require('../index');

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
 */
describe('discovery-proxy', () => {
  before((done) => {
    done();
  });

  it('model is generated for tenant fred', (done) => {
    let model = multiTenancy.findOrCreateNewConnection('fred', new ModelFactory()).model;
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

  after(() => {

  });
});
