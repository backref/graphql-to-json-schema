import { IntrospectionEnumType, IntrospectionField, IntrospectionInputObjectType, IntrospectionInputTypeRef, IntrospectionInputValue, IntrospectionInterfaceType, IntrospectionListTypeRef, IntrospectionNamedTypeRef, IntrospectionNonNullTypeRef, IntrospectionObjectType, IntrospectionOutputTypeRef, IntrospectionScalarType, IntrospectionSchema, IntrospectionType, IntrospectionTypeRef, IntrospectionUnionType } from 'graphql';
export declare const isIntrospectionField: (type: IntrospectionField | IntrospectionInputValue) => type is IntrospectionField;
export declare const isIntrospectionInputValue: (type: IntrospectionField | IntrospectionInputValue) => type is IntrospectionInputValue;
export declare const isIntrospectionListTypeRef: (type: IntrospectionTypeRef | IntrospectionInputTypeRef | IntrospectionOutputTypeRef) => type is IntrospectionListTypeRef<IntrospectionTypeRef>;
export declare const isIntrospectionObjectType: (type: IntrospectionSchema['types'][0]) => type is IntrospectionObjectType;
export declare const isIntrospectionInputObjectType: (type: IntrospectionSchema['types'][0]) => type is IntrospectionInputObjectType;
export declare const isIntrospectionEnumType: (type: IntrospectionSchema['types'][0]) => type is IntrospectionEnumType;
export declare const isIntrospectionScalarType: (type: IntrospectionSchema['types'][0]) => type is IntrospectionScalarType;
export declare const isIntrospectionUnionType: (type: IntrospectionSchema['types'][0]) => type is IntrospectionUnionType;
export declare const isIntrospectionInterfaceType: (type: IntrospectionSchema['types'][0]) => type is IntrospectionInterfaceType;
export declare const isNonNullIntrospectionType: (type: IntrospectionTypeRef) => type is IntrospectionNonNullTypeRef<IntrospectionNamedTypeRef<IntrospectionType>>;
export declare const isIntrospectionDefaultScalarType: (type: IntrospectionSchema['types'][0]) => type is IntrospectionScalarType;
export interface FilterDefinitionsTypesOptions {
    ignoreInternals?: boolean;
}
export declare const filterDefinitionsTypes: (types: IntrospectionType[], opts?: FilterDefinitionsTypesOptions | undefined) => IntrospectionType[];
