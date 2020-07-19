import AJV from 'ajv';
import { JSONSchema6 } from 'json-schema';
import { fromIntrospectionQuery } from '../lib/fromIntrospectionQuery';
import {
  getTodoSchemaIntrospection,
  todoSchemaAsJsonSchema,
} from './fixtures/test-utils';

describe('GraphQL to JSON Schema', () => {
  const { introspection, schema } = getTodoSchemaIntrospection();

  test.todo('from GraphQLSchema object');

  test('from IntrospectionQuery object', () => {
    const result = fromIntrospectionQuery(introspection);
    expect(result).toEqual(<JSONSchema6>todoSchemaAsJsonSchema);
    const validator = new AJV();
    validator.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
    expect(validator.validateSchema(result)).toBe(true);
  });
});
