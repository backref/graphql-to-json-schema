import {IntrospectionQuery, IntrospectionType} from 'graphql'
import * as gq from 'graphql'
import {JSONSchema6} from 'json-schema'
import {includes, partition, reduce} from 'lodash'
import {introspectionTypeReducer, JSONSchema6Acc} from './reducer'
import {filterDefinitionsTypes, isIntrospectionObjectType} from './typeGuards'

// FIXME: finish this type
export interface GraphQLJSONSchema6 extends JSONSchema6 {
  properties: {
    Query: JSONSchema6Acc
    Mutation: JSONSchema6Acc
  }
  definitions: JSONSchema6Acc
}

export interface FromIntrospectionQueryOptions {
  ignoreInternals?: boolean // true by default
}
export const fromIntrospectionQuery = (
  introspection: IntrospectionQuery,
  opts?: FromIntrospectionQueryOptions
): JSONSchema6 => {
  const options = opts || {ignoreInternals: true}
  const {queryType, mutationType} = introspection.__schema

  if (mutationType) {
    const rootMutationType = (introspection.__schema.types as any).find(
      (t: any) => t.name == mutationType.name
    )
    if (rootMutationType) {
      // eslint-disable-next-line
      ;(introspection.__schema.types as any).Mutation = rootMutationType
      ;(introspection.__schema.types as any).Mutation.name = 'Mutation'
    }
  }

  if (queryType) {
    const rootQueryType = (introspection.__schema.types as any).find(
      (t: any) => t.name == queryType.name
    )
    if (rootQueryType) {
      // eslint-disable-next-line
      ;(introspection.__schema.types as any).Query = rootQueryType
      // eslint-disable-next-line
      ;(introspection.__schema.types as any).Query.name = 'Query'
    }
  }
  //////////////////////////////////////////////////////////////////////
  //// Query and Mutation are properties, custom Types are definitions
  //////////////////////////////////////////////////////////////////////
  const [properties, definitions] = partition(
    introspection.__schema.types,
    type => isIntrospectionObjectType(type) && includes(['Query', 'Mutation'], type.name)
  )

  return {
    $schema: 'http://json-schema.org/draft-06/schema#',
    properties: reduce<IntrospectionType, JSONSchema6Acc>(
      properties,
      introspectionTypeReducer('properties'),
      {}
    ),
    definitions: reduce<IntrospectionType, JSONSchema6Acc>(
      filterDefinitionsTypes(definitions, options),
      introspectionTypeReducer('definitions'),
      {}
    ),
  }
}

/**
 * Parses GrapqhQL raw schema (SDL).
 *
 * @param text The raw schema text.
 */
export async function parseGraphQL(text: string, filename?: string): Promise<any> {
  try {
    const schema = gq.buildSchema(text)
    const introspection = await gq.graphql(schema, gq.getIntrospectionQuery())
    if (introspection.errors) {
      // @ts-ignore
      printErrors(introspection.errors, filename)
      process.exit(1)
    }
    if (!introspection?.data) {
      console.error(`Could not parse schema?`)
      process.exit(1)
    }

    return fromIntrospectionQuery(introspection.data as IntrospectionQuery)
  } catch (err) {
    console.error(err)
    throw err
  }
}

function printErrors(errors: gq.GraphQLError[], filename: string) {
  for (const err of errors) {
    const location = err.locations?.[0]
    let line = 0
    let column = 0
    if (location) {
      line = location.line
      column = location.column
    }
    console.error(err.message)
    console.error(`  at ${filename ?? '(string)'}:${line}:${column}`)
  }
}
