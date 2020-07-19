# graphql-2-json-schema

Transform a GraphQL Schema introspection file to a valid JSON Schema.

This package adds support for decorators improving the utility of GraphQL schema as an IDL for
everything.

The end goal is simple:

    GraphQL -> JSON schema -> Javascript string templates -> Generated Code

NO vendor-specific directives needed.

## Decorators

Decorators, aka annotations or attributes in other languages, allows metadata to be attached to
GraphQL schema entities. Decorators emit metadata in the resulting JSON schema. Nothing more.
Utilities like code generators use the metadata as needed.

The syntax is simple

```shell
# decorator with map value
+go_tag({"json": "id", "db": "id"})

# truthy decorator, empty parens default to true
+read_only()
+read_only(false)

# array
+acl_roles(["session", "admin"])

# string
+go_ident("ID")

# number (int, float, etc)
+form_pos(1)
```

Decorator rules

-   MUST be within a quotes `""` description or docstring
-   MUST be on its own line
-   MUST be preceeded by a `+` symbol to disambiguate against `@` directives
-   MUST have valid JSON value within parentheses. An empty parentheses `()` is converted to boolean
    value of `true`.

Decorators example in GraphQL schema

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

The result JSON schema is enriched with `__decorators` property

```javascript
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

To use the `gql2js` CLI utility, first install the package

```sh
yarn global add @backref/graphql-to-json-schema

# OR
npm install -g @backref/graphql-to-json-schema
```

Running the utility

```shell
# output to STDOUT
gql2js example/example.graphql

# output to file
gql2js example/example.graphql -o example.json

# output to directory (use single quotes)
gql2js 'example/**/*.graphql' -d _temp
```

Programmatic, see [example](example/index.js)

```sh
yarn add @backref/graphql-to-json-schema
```

```javascript
// node example
const g2j = require('@backref/graphql-to-json-schema')

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
`

const jsonSchema = await g2j.parseGraphQL(text)
console.log(JSON.stringify(jsonSchema, null, 2))
```

## License

This package is MIT licensed

Original work by

-   [wittydeveloper](https://github.com/wittydeveloper/graphql-to-json-schema)

Enhancements by

-   [aldeed](https://github.com/aldeed/graphql-to-json-schema)
