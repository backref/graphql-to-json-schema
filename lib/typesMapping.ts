import {
  IntrospectionInputType,
  IntrospectionInputTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionOutputType,
  IntrospectionOutputTypeRef,
  IntrospectionTypeRef,
} from 'graphql'
import {JSONSchema6, JSONSchema6TypeName} from 'json-schema'
import {includes} from 'lodash'
import {isIntrospectionListTypeRef, isNonNullIntrospectionType} from './typeGuards'

export type GraphQLTypeNames = 'String' | 'Int' | 'Float' | 'Boolean'

export const typesMapping: {[k in GraphQLTypeNames]: JSONSchema6TypeName} = {
  Boolean: 'boolean',
  String: 'string',
  Int: 'integer',
  Float: 'number',
}

// Convert a GraphQL Type to a valid JSON Schema type
export type GraphqlToJSONTypeArg =
  | IntrospectionTypeRef
  | IntrospectionInputTypeRef
  | IntrospectionOutputTypeRef
export const graphqlToJSONType = (k: GraphqlToJSONTypeArg): JSONSchema6 => {
  if (isIntrospectionListTypeRef(k)) {
    return {
      type: 'array',
      items: graphqlToJSONType(k.ofType),
    }
  } else if (isNonNullIntrospectionType(k)) {
    return graphqlToJSONType(k.ofType)
  } else {
    const name = (k as IntrospectionNamedTypeRef<IntrospectionInputType | IntrospectionOutputType>)
      .name
    return includes(['OBJECT', 'INPUT_OBJECT', 'ENUM', 'SCALAR', 'INTERFACE', 'UNION'], k.kind)
      ? includes(['OBJECT', 'INPUT_OBJECT', 'ENUM', 'INTERFACE', 'UNION'], k.kind)
        ? {$ref: `#/definitions/${name}`}
        : // tslint:disable-next-line:no-any
          {$ref: `#/definitions/${name}`, type: (typesMapping as any)[name]}
      : {type: (typesMapping as any)[name]}
  }
}
