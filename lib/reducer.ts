import {IntrospectionField, IntrospectionInputValue, IntrospectionType} from 'graphql'
import {JSONSchema6} from 'json-schema'
import {filter, map, MemoListIterator, reduce} from 'lodash'
import {
  isIntrospectionDefaultScalarType,
  isIntrospectionEnumType,
  isIntrospectionField,
  isIntrospectionInputObjectType,
  isIntrospectionInputValue,
  isIntrospectionInterfaceType,
  isIntrospectionListTypeRef,
  isIntrospectionObjectType,
  isIntrospectionScalarType,
  isIntrospectionUnionType,
  isNonNullIntrospectionType,
} from './typeGuards'
import {graphqlToJSONType, typesMapping} from './typesMapping'
import {parseDescriptionDecorators} from './decorators'

export type JSONSchema6Acc = {
  [k: string]: JSONSchema6
}

// Extract GraphQL no-nullable types
type GetRequiredFieldsType = ReadonlyArray<IntrospectionInputValue | IntrospectionField>
export const getRequiredFields = (fields: GetRequiredFieldsType) =>
  map(
    filter(
      fields,
      f => isNonNullIntrospectionType(f.type) && !isIntrospectionListTypeRef(f.type.ofType)
    ),
    f => f.name
  )

export type IntrospectionFieldReducerItem = IntrospectionField | IntrospectionInputValue

// reducer for a queries/mutations
export const propertiesIntrospectionFieldReducer: MemoListIterator<
  IntrospectionFieldReducerItem,
  JSONSchema6Acc,
  ReadonlyArray<IntrospectionFieldReducerItem>
> = (acc, curr: IntrospectionFieldReducerItem): JSONSchema6Acc => {
  if (isIntrospectionField(curr)) {
    const returnType = isNonNullIntrospectionType(curr.type)
      ? graphqlToJSONType(curr.type.ofType)
      : graphqlToJSONType(curr.type)
    acc[curr.name] = {
      type: 'object',
      properties: {
        return: returnType,
        arguments: {
          type: 'object',
          properties: reduce<IntrospectionFieldReducerItem, JSONSchema6Acc>(
            curr.args as IntrospectionFieldReducerItem[],
            propertiesIntrospectionFieldReducer,
            {}
          ),
          required: getRequiredFields(curr.args),
        },
      },
      required: [],
    }
  } else if (isIntrospectionInputValue(curr)) {
    const returnType = isNonNullIntrospectionType(curr.type)
      ? graphqlToJSONType(curr.type.ofType)
      : graphqlToJSONType(curr.type)
    acc[curr.name] = returnType
  }
  parseMetaAndDescription(acc, curr)
  return acc
}

// reducer for a custom types
export const definitionsIntrospectionFieldReducer: MemoListIterator<
  IntrospectionFieldReducerItem,
  JSONSchema6Acc,
  ReadonlyArray<IntrospectionFieldReducerItem>
> = (acc, curr: IntrospectionFieldReducerItem): JSONSchema6Acc => {
  if (isIntrospectionField(curr)) {
    const returnType = isNonNullIntrospectionType(curr.type)
      ? graphqlToJSONType(curr.type.ofType)
      : graphqlToJSONType(curr.type)
    acc[curr.name] = returnType
  } else if (isIntrospectionInputValue(curr)) {
    const returnType = isNonNullIntrospectionType(curr.type)
      ? graphqlToJSONType(curr.type.ofType)
      : graphqlToJSONType(curr.type)
    acc[curr.name] = returnType
  }
  parseMetaAndDescription(acc, curr)
  return acc
}

// Reducer for each type exposed by the GraphQL Schema
export const introspectionTypeReducer: (
  type: 'definitions' | 'properties'
) => MemoListIterator<IntrospectionType, JSONSchema6Acc, IntrospectionType[]> = type => (
  acc,
  curr: IntrospectionType
): JSONSchema6Acc => {
  const fieldReducer =
    type === 'definitions'
      ? definitionsIntrospectionFieldReducer
      : propertiesIntrospectionFieldReducer

  if (isIntrospectionObjectType(curr)) {
    acc[curr.name] = {
      type: 'object',
      properties: reduce<IntrospectionFieldReducerItem, JSONSchema6Acc>(
        curr.fields as IntrospectionFieldReducerItem[],
        fieldReducer,
        {}
      ),
      // ignore required for Mutations/Queries
      required: type === 'definitions' ? getRequiredFields(curr.fields) : [],
    }
  } else if (isIntrospectionInputObjectType(curr)) {
    acc[curr.name] = {
      type: 'object',
      properties: reduce<IntrospectionFieldReducerItem, JSONSchema6Acc>(
        curr.inputFields as IntrospectionFieldReducerItem[],
        fieldReducer,
        {}
      ),
      required: getRequiredFields(curr.inputFields),
    }
  } else if (isIntrospectionInterfaceType(curr)) {
    acc[curr.name] = {
      type: 'object',
      properties: reduce<IntrospectionFieldReducerItem, JSONSchema6Acc>(
        curr.fields as IntrospectionFieldReducerItem[],
        fieldReducer,
        {}
      ),
      // ignore required for Mutations/Queries
      required: type === 'definitions' ? getRequiredFields(curr.fields) : [],
    }
  } else if (isIntrospectionEnumType(curr)) {
    acc[curr.name] = {
      type: 'string',
      anyOf: curr.enumValues.map(item => {
        const meta = parseDescriptionDecorators(item.description)
        const result = {
          enum: [item.name],
          title: meta.description || item.name,
          description: meta.description || undefined,
        }
        if (meta.__decorators) {
          // @ts-ignore
          result.__decorators = meta.__decorators
        }
        return result
      }),
    }
    parseMetaAndDescription(acc, curr)
  } else if (isIntrospectionDefaultScalarType(curr)) {
    acc[curr.name] = {
      type: (typesMapping as any)[curr.name],
      title: curr.name,
    }
  } else if (isIntrospectionScalarType(curr)) {
    // @ts-ignore
    acc[curr.name] = {
      type: 'object',
      // @ts-ignore
      title: curr.name,
    }
  } else if (isIntrospectionUnionType(curr)) {
    acc[curr.name] = {
      type: 'object',
      anyOf: curr.possibleTypes.map(item => ({
        $ref: '#/definitions/' + item.name,
      })),
    }
  }

  parseMetaAndDescription(acc, curr)
  return acc
}

/** Parses desripttion for possible meta attributes */
function parseMetaAndDescription(
  acc: JSONSchema6Acc,
  introType: Pick<IntrospectionType, 'description' | 'name'>
) {
  const {name, description} = introType
  const meta = parseDescriptionDecorators(description)
  if (meta.description) {
    acc[name].description = meta.description
  }
  if (meta.__decorators) {
    // @ts-ignore
    acc[name].__decorators = meta.__decorators
  }
}
