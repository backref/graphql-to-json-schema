import { IntrospectionInputTypeRef, IntrospectionOutputTypeRef, IntrospectionTypeRef } from 'graphql';
import { JSONSchema6, JSONSchema6TypeName } from 'json-schema';
export declare type GraphQLTypeNames = 'String' | 'Int' | 'Float' | 'Boolean';
export declare const typesMapping: {
    [k in GraphQLTypeNames]: JSONSchema6TypeName;
};
export declare type GraphqlToJSONTypeArg = IntrospectionTypeRef | IntrospectionInputTypeRef | IntrospectionOutputTypeRef;
export declare const graphqlToJSONType: (k: GraphqlToJSONTypeArg) => JSONSchema6;
