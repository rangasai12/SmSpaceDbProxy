const chai = require('chai');
const chaiHttp = require('chai-http');
const { db, initDatabase } = require('../server/database');
const { app, server } = require('../server/app');
const schema = require('../server/schema/schema.json');

chai.use(chaiHttp);
const expect = chai.expect;

// Clear and initialize the database before running tests
before(function (done) {
  db.serialize(() => {
    // Clear all tables
    for (const tableName in schema) {
      if (schema.hasOwnProperty(tableName)) {
        db.run(`DELETE FROM ${tableName}`);
      }
    }

    // Initialize the database with test data
    initDatabase();

    done();
  });
});

describe('CRUD Operations', function () {
  for (const tableName in schema) {
    if (schema.hasOwnProperty(tableName)) {
      describe(`Table: ${tableName}`, function () {
        // Create
        it(`create a new record in ${tableName}`, function (done) {
          const testData = generateTestData(tableName);
          chai
            .request(app)
            .post(`/collection/${tableName}`)
            .send(testData)
            .end(function (err, res) {
              if (err) {
                console.error(err);
                done(err);
              } else {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('id');
                done(); // Continue with the test
              }
            });
        });

        // Update
        it(`update a record in ${tableName} by ID`, function (done) {
          const testData = generateTestData(tableName);

          chai
            .request(app)
            .post(`/collection/${tableName}/1`)
            .send(testData)
            .end(function (err, res) {
              console.log(err);
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('message', 'Record updated');
              done();
            });
        });

                it(`return a 404 error when trying to read a non-existent record from ${tableName} by ID`, function (done) {
          chai
            .request(app)
            .get(`/collection/${tableName}/9999`)
            .end(function (err, res) {
              expect(res).to.have.status(404);
              expect(res.body).to.have.property('error', 'Record not found');
              done();
            });
        });

        // Update (Edge Case: Non-Existent ID)
        it(`return a 404 error when trying to update a non-existent record in ${tableName} by ID`, function (done) {
          const testData = generateTestData(tableName);

          chai
            .request(app)
            .post(`/collection/${tableName}/9999`)
            .send(testData)
            .end(function (err, res) {
              expect(res).to.have.status(404);
              expect(res.body).to.have.property('error', 'Record not found');
              done();
            });
        });

        // Delete (Edge Case: Non-Existent ID)
        it(`return a 404 error when trying to delete a non-existent record from ${tableName} by ID`, function (done) {
          chai
            .request(app)
            .delete(`/collection/${tableName}/9999`)
            .end(function (err, res) {
              expect(res).to.have.status(404);
              expect(res.body).to.have.property('error', 'Record not found');
              done();
            });
        });


        // Read
        it(`read a record from ${tableName} by ID`, function (done) {

          chai
            .request(app)
            .get(`/collection/${tableName}/1`)
            .end(function (err, res) {
              console.log("Errors" + err);
              expect(res).to.have.status(200);
              done();
            });
        });

        it(`delete a record from ${tableName} by ID`, function (done) {

          chai
            .request(app)
            .delete(`/collection/${tableName}/1`)
            .end(function (err, res) {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('message', 'Record deleted');
              done();
            });
        });

      });
    }
  }
});



function generateTestData(tableName) {
  const testData = {};
  const columns = schema[tableName];
  for (const colName in columns) {
  if (columns.hasOwnProperty(colName)) {
      const colType = columns[colName];
      if (colType.includes("PRIMARY")){
        continue;
      }
      else if (colType.includes('TEXT')) {
      testData[colName] = `Test${colName}`;
      } else if (colType.includes('INTEGER')) {
      testData[colName] = 42;
      } else if (colType.includes('REAL')) {
      testData[colName] = 42.5;
      }

  }
  }
  console.log(testData);
  return testData;
}