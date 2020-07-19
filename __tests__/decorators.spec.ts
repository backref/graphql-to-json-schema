import * as meta from '../lib/decorators'
import AJV from 'ajv'
import {JSONSchema6} from 'json-schema'
import {fromIntrospectionQuery} from '../lib/fromIntrospectionQuery'
import {getTodoSchemaIntrospection, todoSchemaAsJsonSchema} from './fixtures/test-utils-decorators'
import jsonSchema06DraftJSON from 'ajv/lib/refs/json-schema-draft-06.json'

describe('Decorators in Description', () => {
  test('no attributes', () => {
    const table = [
      {description: '', expected: {}},
      {description: null, expected: {}},
      {description: undefined, expected: {}},
      {description: 'foo', expected: {description: 'foo'}},
    ]

    for (const {description, expected} of table) {
      const actual = meta.parseDescriptionDecorators(description)
      expect(actual).toEqual(expected)
    }
  })

  test('description with decorators', () => {
    const table = [
      {
        name: 'newline',
        description: `
            Foo
            +role(["session", "admin"])
            +go_tag({"db": "foo"})
            Bar
            `,
        expected: {
          description: 'Foo\nBar',
          __decorators: {role: ['session', 'admin'], go_tag: {db: 'foo'}},
        },
      },
      {
        name: 'must use newline',
        description: `
            Foo  +role(["session", "admin"])
            `,
        expected: {
          description: 'Foo  +role(["session", "admin"])',
        },
      },
      {
        name: 'empty parens',
        description: `
            +ignore()
            `,
        expected: {
          __decorators: {ignore: true},
        },
      },

      {
        name: 'multiline array',
        description: `
          +acl_role([
            "session",
            "admin"
          ])
        `,
        expected: {
          __decorators: {acl_role: ['session', 'admin']},
        },
      },
      {
        name: 'multiline array',
        description: `
          foo
          +go_tag({
            "db": "id",
            "json": "id"
          })
          bar
        `,
        expected: {
          __decorators: {go_tag: {json: 'id', db: 'id'}},
          description: 'foo\nbar',
        },
      },
    ]

    for (const {description, expected} of table) {
      const actual = meta.parseDescriptionDecorators(description)
      expect(actual).toEqual(expected)
    }
  })
})

describe('GraphQL to JSON Schema w decorators', () => {
  const {introspection} = getTodoSchemaIntrospection()

  test.todo('from GraphQLSchema object')

  test('from IntrospectionQuery object', () => {
    const result = fromIntrospectionQuery(introspection)
    expect(result).toEqual(<JSONSchema6>todoSchemaAsJsonSchema)
    const validator = new AJV()
    validator.addMetaSchema(jsonSchema06DraftJSON)
    expect(validator.validateSchema(result)).toBe(true)
  })
})
