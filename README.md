# graphql-2-json-schema

Transform a GraphQL Schema introspection file to a valid JSON Schema.

This package adds support for decorators improving the utility of GraphQL schema
as an IDL for everything.

## Decorators

Decorator rules

- MUST be within a quotes `""` description or docstring
- MUST be on its own line
- MUST be preceeded by a `+` symbol to disambiguate against `@` directives
- MUST have valid JSON value within parentheses. An empty parentheses `()`
  is converted to boolean value of `true`.

Decorators in GraphQL schema

```graphql
type Todo {
  """
  The primary key.

  +read_only()
  +go_ident("ID")
  +go_tag({"db": "id", "json": "id,omitempty"})
  """
  id: String!
  name: String!
  completed: Boolean
}
```

The result JSON schema is enriched with `__decorators` props for use by
code generators.

```js
Todo: {
    type: 'object',
    properties: {
        id: {
            __decorators: {
                go_ident: "ID",
                go_tag: {db:"id", json: "id,omitempty"},
                read_only: true
            },
            description: 'The primary key',
            type: 'string'
        },
        name: { type: 'string' },
        completed: { type: 'boolean' },
    },
    required: ['id', 'name']
}
```

## Usage

Run either

    npm install -g @backref/graphql-to-json-schema

Or

    yarn global add @backref/graphql-to-json-schema

To use the `gql2js` utility

```shell
# output to STDOUT
gql2js example/example.graphql

# output to file
gql2js example/example.graphql -o example.json

# output to idl directory (use single quotes)
gql2js 'idl/**/*.graphql' -d idl
```

Programmatic

```sh
yarn add @backref/graphql-to-json-schema
```

```javascript
// node example
const g2j = require('@backref/graphql-to-json-schema');

const text = `
type Todo {
  """
  The primary key.

  +read_only()
  +go_ident("ID")
  +go_tag({"db": "id", "json": "id,omitempty"})
  """
  id: String!
  name: String!
  completed: Boolean
}
`;

const jsonSchema = g2j.parseGraphQL(text);
console.log(JSON.stringify(jsonSchema, null, 2));
```

## License

This package is MIT licensed

Original work by

- [wittydeveloper](https://github.com/wittydeveloper/graphql-to-json-schema)

Enhancements by

- [aldeed](https://github.com/aldeed/graphql-to-json-schema)
