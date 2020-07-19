import { IntrospectionField, IntrospectionInputValue, IntrospectionType } from 'graphql';
import { JSONSchema6 } from 'json-schema';
import { MemoListIterator } from 'lodash';
export declare type JSONSchema6Acc = {
    [k: string]: JSONSchema6;
};
declare type GetRequiredFieldsType = ReadonlyArray<IntrospectionInputValue | IntrospectionField>;
export declare const getRequiredFields: (fields: GetRequiredFieldsType) => string[];
export declare type IntrospectionFieldReducerItem = IntrospectionField | IntrospectionInputValue;
export declare const propertiesIntrospectionFieldReducer: MemoListIterator<IntrospectionFieldReducerItem, JSONSchema6Acc, ReadonlyArray<IntrospectionFieldReducerItem>>;
export declare const definitionsIntrospectionFieldReducer: MemoListIterator<IntrospectionFieldReducerItem, JSONSchema6Acc, ReadonlyArray<IntrospectionFieldReducerItem>>;
export declare const introspectionTypeReducer: (type: 'definitions' | 'properties') => MemoListIterator<IntrospectionType, JSONSchema6Acc, IntrospectionType[]>;
export {};
