import {
  buildSchema,
  GraphQLSchema,
  graphqlSync,
  getIntrospectionQuery,
  IntrospectionQuery,
} from 'graphql';
import { JSONSchema6 } from 'json-schema';

type GetTodoSchemaIntrospectionResult = {
  schema: GraphQLSchema;
  introspection: IntrospectionQuery;
};
export const getTodoSchemaIntrospection = (): GetTodoSchemaIntrospectionResult => {
  const schema = buildSchema(`
        """
        IDL meta

        +package("idl")
        +namespace("github.com/backref/prc")
        """
        scalar idl

        "Anything with an ID can be a node"
        interface Node {
            """
            A unique identifier
            +go_tag({"db": "primary_key"})
            """
            id: String!
        }

        "A custom scalar"
        scalar DateTime

        "A ToDo Object"
        type Todo implements Node {
            "A unique identifier"
            id: String!
            name: String!
            completed: Boolean
            color: Color
            """
            +go_tag({"json": "added_at,omitempty", "db": "added_at"})
            """
            addedAt: DateTime
        }

        """
        Example union
        +ident("todoAndMore")
        """
        union TodoAndMore = Todo

        """
        A type that describes ToDoInputType. Its description might not
        fit within the bounds of 80 width and so you want MULTILINE
        """
        input TodoInputType {
            "+pk()"
            name: String!
            completed: Boolean
            color: Color
        }

        """+go_type("int32")"""
        enum Color {
          """
          Red color
          +go_literal("iota")
          """
          RED
          "Green color"
          GREEN
        }

        type Query {
            """
            Get a node
            +method("GET")
            """
            node(
                "Identifier"
                id: String!
            ): Node!

            todoAndMore: TodoAndMore

            todo(
                "todo identifier"
                id: String!
            ): Todo!

            todos: [Todo!]!
        }

        type Mutation {
            """
            Update Todo

            +role(["admin", "session"])
            """
            update_todo(id: String!, todo: TodoInputType!): Todo
            create_todo(todo: TodoInputType!): Todo
        }
`);

  const result = graphqlSync(schema, getIntrospectionQuery());
  return {
    introspection: result.data as IntrospectionQuery,
    schema,
  };
};

export const todoSchemaAsJsonSchema: JSONSchema6 = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  properties: {
    Query: {
      type: 'object',
      properties: {
        node: {
          // @ts-ignore
          __decorators: {
            method: 'GET',
          },
          description: 'Get a node',
          type: 'object',
          properties: {
            arguments: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Identifier',
                  $ref: '#/definitions/String',
                },
              },
              required: ['id'],
            },
            return: {
              $ref: '#/definitions/Node',
            },
          },
          required: [],
        },
        todo: {
          type: 'object',
          properties: {
            arguments: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'todo identifier',
                  $ref: '#/definitions/String',
                },
              },
              required: ['id'],
            },
            return: {
              $ref: '#/definitions/Todo',
            },
          },
          required: [],
        },
        todoAndMore: {
          type: 'object',
          properties: {
            arguments: {
              type: 'object',
              properties: {},
              required: [],
            },
            return: {
              $ref: '#/definitions/TodoAndMore',
            },
          },
          required: [],
        },
        todos: {
          type: 'object',
          properties: {
            arguments: {
              type: 'object',
              properties: {},
              required: [],
            },
            return: {
              type: 'array',
              items: { $ref: '#/definitions/Todo' },
            },
          },
          required: [],
        },
      },
      required: [],
    },
    Mutation: {
      type: 'object',
      properties: {
        update_todo: {
          // @ts-ignore
          __decorators: {
            role: ['admin', 'session'],
          },
          description: 'Update Todo',
          type: 'object',
          properties: {
            arguments: {
              type: 'object',
              properties: {
                id: { type: 'string', $ref: '#/definitions/String' },
                todo: { $ref: '#/definitions/TodoInputType' },
              },
              required: ['id', 'todo'],
            },
            return: {
              $ref: '#/definitions/Todo',
            },
          },
          required: [],
        },
        create_todo: {
          type: 'object',
          properties: {
            arguments: {
              type: 'object',
              properties: {
                todo: { $ref: '#/definitions/TodoInputType' },
              },
              required: ['todo'],
            },
            return: {
              $ref: '#/definitions/Todo',
            },
          },
          required: [],
        },
      },
      required: [],
    },
  },
  definitions: {
    Boolean: {
      type: 'boolean',
      title: 'Boolean',
      description: 'The `Boolean` scalar type represents `true` or `false`.',
    },
    String: {
      type: 'string',
      title: 'String',
      description:
        'The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.',
    },
    DateTime: {
      type: 'object',
      title: 'DateTime',
      description: 'A custom scalar',
    },
    Node: {
      type: 'object',
      description: 'Anything with an ID can be a node',
      properties: {
        id: {
          type: 'string',
          description: 'A unique identifier',
          $ref: '#/definitions/String',
          // @ts-ignore
          __decorators: {
            go_tag: { db: 'primary_key' },
          },
        },
      },
      required: ['id'],
    },
    Todo: {
      type: 'object',
      description: 'A ToDo Object',
      properties: {
        id: {
          type: 'string',
          description: 'A unique identifier',
          $ref: '#/definitions/String',
        },
        name: { type: 'string', $ref: '#/definitions/String' },
        completed: { type: 'boolean', $ref: '#/definitions/Boolean' },
        color: { $ref: '#/definitions/Color' },
        addedAt: {
          $ref: '#/definitions/DateTime',
          // @ts-ignore
          __decorators: {
            go_tag: { json: 'added_at,omitempty', db: 'added_at' },
          },
        },
      },
      required: ['id', 'name'],
    },
    Color: {
      // @ts-ignore
      __decorators: {
        go_type: 'int32',
      },
      type: 'string',
      anyOf: [
        {
          enum: ['RED'],
          title: 'Red color',
          description: 'Red color',
          // @ts-ignore
          __decorators: {
            go_literal: 'iota',
          },
        },
        {
          enum: ['GREEN'],
          title: 'Green color',
          description: 'Green color',
        },
      ],
    },
    TodoAndMore: {
      // @ts-ignore
      __decorators: {
        ident: 'todoAndMore',
      },
      type: 'object',
      description: 'Example union',
      anyOf: [{ $ref: '#/definitions/Todo' }],
    },
    TodoInputType: {
      type: 'object',
      description:
        'A type that describes ToDoInputType. Its description might not\nfit within the bounds of 80 width and so you want MULTILINE',
      properties: {
        name: {
          type: 'string',
          $ref: '#/definitions/String',
          // @ts-ignore
          __decorators: { pk: true },
        },
        completed: { type: 'boolean', $ref: '#/definitions/Boolean' },
        color: { $ref: '#/definitions/Color' },
      },
      required: ['name'],
    },

    idl: {
      // @ts-ignore
      __decorators: {
        namespace: 'github.com/backref/prc',
        package: 'idl',
      },
      description: 'IDL meta',
      title: 'idl',
      type: 'object',
    },
  },
};
