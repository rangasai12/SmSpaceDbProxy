const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const DB_FILE = path.join(__dirname, 'database.sqlite3');
const SCHEMA_FILE = path.join(__dirname, 'schema', 'schema.json');

const db = new sqlite3.Database(DB_FILE);

function initDatabase() {
    db.serialize(() => {
      // Load the schema from the JSON file
      const schemaPath = SCHEMA_FILE;
      const schemaData = fs.readFileSync(schemaPath, 'utf8');
      const schema = JSON.parse(schemaData);
  
      // Iterate over tables in the schema
      for (const tableName in schema) {
        if (schema.hasOwnProperty(tableName)) {
          const columns = schema[tableName];
  
          // Create the table if it doesn't exist
          const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${Object.entries(columns)
            .map(([col, type]) => `${col} ${type}`)
            .join(', ')})`;
  
          db.run(createTableQuery, (err) => {
            if (err) {
              console.error(`Error creating table ${tableName}: ${err.message}`);
            } else {
              console.log(`Table ${tableName} created.`);
            }
          });
        }
      }
    });
  }
  
  module.exports = { db, initDatabase };
  