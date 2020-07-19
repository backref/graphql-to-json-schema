const gq = require('graphql');
const g2j = require('../dist');
const fs = require('fs');
const fp = require('path');

const schemaText = fs.readFileSync(
  fp.join(__dirname, 'example.graphql'),
  'utf-8'
);
const schema = gq.buildSchema(schemaText);
const introspection = gq.graphqlSync(schema, gq.getIntrospectionQuery()).data;
const jsonSchema = g2j.fromIntrospectionQuery(introspection);
console.log(JSON.stringify(jsonSchema, null, 2));
