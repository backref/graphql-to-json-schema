const g2j = require('../dist');
const fs = require('fs');
const fp = require('path');

const schemaText = fs.readFileSync(
  fp.join(__dirname, 'example.graphql'),
  'utf-8'
);
const jsonSchema = g2j.parseGraphQL(schemaText);
console.log(JSON.stringify(jsonSchema, null, 2));
