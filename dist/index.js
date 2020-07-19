'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var gq = require('graphql');
var lodash = require('lodash');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var isIntrospectionField = function (type) { return lodash.has(type, 'args'); };
var isIntrospectionInputValue = function (type) { return lodash.has(type, 'defaultValue'); };
var isIntrospectionListTypeRef = function (type) { return type.kind === 'LIST'; };
var isIntrospectionObjectType = function (type) { return type.kind === 'OBJECT'; };
var isIntrospectionInputObjectType = function (type) { return type.kind === 'INPUT_OBJECT'; };
var isIntrospectionEnumType = function (type) { return type.kind === 'ENUM'; };
var isIntrospectionScalarType = function (type) { return type.kind === 'SCALAR'; };
var isIntrospectionUnionType = function (type) {
    return type.kind === 'UNION';
};
var isIntrospectionInterfaceType = function (type) { return type.kind === 'INTERFACE'; };
var isNonNullIntrospectionType = function (type) {
    return type.kind === 'NON_NULL';
};
var isIntrospectionDefaultScalarType = function (type) {
    return type.kind === 'SCALAR' && lodash.includes(['Boolean', 'String', 'Int', 'Float'], type.name);
};
var filterDefinitionsTypes = function (types, opts) {
    var ignoreInternals = opts && opts.ignoreInternals;
    return lodash.filter(types, function (type) {
        return ((isIntrospectionObjectType(type) && !!type.fields) ||
            (isIntrospectionInputObjectType(type) && !!type.inputFields) ||
            (isIntrospectionEnumType(type) && !!type.enumValues) ||
            (isIntrospectionScalarType(type) && !!type.name) ||
            isIntrospectionInterfaceType(type) ||
            isIntrospectionUnionType(type)) &&
            (!ignoreInternals || (ignoreInternals && !lodash.startsWith(type.name, '__')));
    });
};

var typesMapping = {
    Boolean: 'boolean',
    String: 'string',
    Int: 'integer',
    Float: 'number',
};
var graphqlToJSONType = function (k) {
    if (isIntrospectionListTypeRef(k)) {
        return {
            type: 'array',
            items: graphqlToJSONType(k.ofType),
        };
    }
    else if (isNonNullIntrospectionType(k)) {
        return graphqlToJSONType(k.ofType);
    }
    else {
        var name_1 = k
            .name;
        return lodash.includes(['OBJECT', 'INPUT_OBJECT', 'ENUM', 'SCALAR', 'INTERFACE', 'UNION'], k.kind)
            ? lodash.includes(['OBJECT', 'INPUT_OBJECT', 'ENUM', 'INTERFACE', 'UNION'], k.kind)
                ? { $ref: "#/definitions/" + name_1 }
                :
                    { $ref: "#/definitions/" + name_1, type: typesMapping[name_1] }
            : { type: typesMapping[name_1] };
    }
};

function safeParse(s) {
    if (!s)
        return true;
    try {
        return JSON.parse(s);
    }
    catch (_a) {
        return "INVALID_JSON: " + s;
    }
}
function parseDescriptionDecorators(description) {
    if (!description)
        return {};
    var reDecorators = /^\s*\+([a-z]([a-zA-z_])*)\(([^)]*)\)\s*$/gm;
    var reNewline = /^$|^\s+|\s+$|\n\n/gm;
    var m;
    var desc = '';
    var startIndex = 0;
    var meta = {};
    var hasMeta = false;
    while ((m = reDecorators.exec(description)) !== null) {
        desc += description.substring(startIndex, m.index);
        if (m.index === reDecorators.lastIndex) {
            reDecorators.lastIndex++;
        }
        startIndex = reDecorators.lastIndex;
        meta[m[1]] = safeParse(m[3]);
        hasMeta = true;
    }
    if (startIndex === 0) {
        desc = description;
    }
    else if (startIndex < description.length) {
        desc += description.substring(startIndex);
    }
    desc = desc.replace(reNewline, '');
    var result = {};
    if (desc)
        result.description = desc.trim();
    if (hasMeta)
        result.__decorators = meta;
    return result;
}

var getRequiredFields = function (fields) {
    return lodash.map(lodash.filter(fields, function (f) { return isNonNullIntrospectionType(f.type) && !isIntrospectionListTypeRef(f.type.ofType); }), function (f) { return f.name; });
};
var propertiesIntrospectionFieldReducer = function (acc, curr) {
    if (isIntrospectionField(curr)) {
        var returnType = isNonNullIntrospectionType(curr.type)
            ? graphqlToJSONType(curr.type.ofType)
            : graphqlToJSONType(curr.type);
        acc[curr.name] = {
            type: 'object',
            properties: {
                "return": returnType,
                arguments: {
                    type: 'object',
                    properties: lodash.reduce(curr.args, propertiesIntrospectionFieldReducer, {}),
                    required: getRequiredFields(curr.args),
                },
            },
            required: [],
        };
    }
    else if (isIntrospectionInputValue(curr)) {
        var returnType = isNonNullIntrospectionType(curr.type)
            ? graphqlToJSONType(curr.type.ofType)
            : graphqlToJSONType(curr.type);
        acc[curr.name] = returnType;
    }
    parseMetaAndDescription(acc, curr);
    return acc;
};
var definitionsIntrospectionFieldReducer = function (acc, curr) {
    if (isIntrospectionField(curr)) {
        var returnType = isNonNullIntrospectionType(curr.type)
            ? graphqlToJSONType(curr.type.ofType)
            : graphqlToJSONType(curr.type);
        acc[curr.name] = returnType;
    }
    else if (isIntrospectionInputValue(curr)) {
        var returnType = isNonNullIntrospectionType(curr.type)
            ? graphqlToJSONType(curr.type.ofType)
            : graphqlToJSONType(curr.type);
        acc[curr.name] = returnType;
    }
    parseMetaAndDescription(acc, curr);
    return acc;
};
var introspectionTypeReducer = function (type) { return function (acc, curr) {
    var fieldReducer = type === 'definitions'
        ? definitionsIntrospectionFieldReducer
        : propertiesIntrospectionFieldReducer;
    if (isIntrospectionObjectType(curr)) {
        acc[curr.name] = {
            type: 'object',
            properties: lodash.reduce(curr.fields, fieldReducer, {}),
            required: type === 'definitions' ? getRequiredFields(curr.fields) : [],
        };
    }
    else if (isIntrospectionInputObjectType(curr)) {
        acc[curr.name] = {
            type: 'object',
            properties: lodash.reduce(curr.inputFields, fieldReducer, {}),
            required: getRequiredFields(curr.inputFields),
        };
    }
    else if (isIntrospectionInterfaceType(curr)) {
        acc[curr.name] = {
            type: 'object',
            properties: lodash.reduce(curr.fields, fieldReducer, {}),
            required: type === 'definitions' ? getRequiredFields(curr.fields) : [],
        };
    }
    else if (isIntrospectionEnumType(curr)) {
        acc[curr.name] = {
            type: 'string',
            anyOf: curr.enumValues.map(function (item) {
                var meta = parseDescriptionDecorators(item.description);
                var result = {
                    "enum": [item.name],
                    title: meta.description || item.name,
                    description: meta.description || undefined,
                };
                if (meta.__decorators) {
                    result.__decorators = meta.__decorators;
                }
                return result;
            }),
        };
        parseMetaAndDescription(acc, curr);
    }
    else if (isIntrospectionDefaultScalarType(curr)) {
        acc[curr.name] = {
            type: typesMapping[curr.name],
            title: curr.name,
        };
    }
    else if (isIntrospectionScalarType(curr)) {
        acc[curr.name] = {
            type: 'object',
            title: curr.name,
        };
    }
    else if (isIntrospectionUnionType(curr)) {
        acc[curr.name] = {
            type: 'object',
            anyOf: curr.possibleTypes.map(function (item) { return ({
                $ref: '#/definitions/' + item.name,
            }); }),
        };
    }
    parseMetaAndDescription(acc, curr);
    return acc;
}; };
function parseMetaAndDescription(acc, introType) {
    var name = introType.name, description = introType.description;
    var meta = parseDescriptionDecorators(description);
    if (meta.description) {
        acc[name].description = meta.description;
    }
    if (meta.__decorators) {
        acc[name].__decorators = meta.__decorators;
    }
}

var fromIntrospectionQuery = function (introspection, opts) {
    var options = opts || { ignoreInternals: true };
    var _a = introspection.__schema, queryType = _a.queryType, mutationType = _a.mutationType;
    if (mutationType) {
        var rootMutationType = introspection.__schema.types.find(function (t) { return t.name == mutationType.name; });
        if (rootMutationType) {
            introspection.__schema.types.Mutation = rootMutationType;
            introspection.__schema.types.Mutation.name = 'Mutation';
        }
    }
    if (queryType) {
        var rootQueryType = introspection.__schema.types.find(function (t) { return t.name == queryType.name; });
        if (rootQueryType) {
            introspection.__schema.types.Query = rootQueryType;
            introspection.__schema.types.Query.name = 'Query';
        }
    }
    var _b = lodash.partition(introspection.__schema.types, function (type) { return isIntrospectionObjectType(type) && lodash.includes(['Query', 'Mutation'], type.name); }), properties = _b[0], definitions = _b[1];
    return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        properties: lodash.reduce(properties, introspectionTypeReducer('properties'), {}),
        definitions: lodash.reduce(filterDefinitionsTypes(definitions, options), introspectionTypeReducer('definitions'), {}),
    };
};
function parseGraphQL(text, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var schema, introspection, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    schema = gq.buildSchema(text);
                    return [4, gq.graphql(schema, gq.getIntrospectionQuery())];
                case 1:
                    introspection = _a.sent();
                    if (introspection.errors) {
                        printErrors(introspection.errors, filename);
                        process.exit(1);
                    }
                    if (!(introspection === null || introspection === void 0 ? void 0 : introspection.data)) {
                        console.error("Could not parse schema?");
                        process.exit(1);
                    }
                    return [2, fromIntrospectionQuery(introspection.data)];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    throw err_1;
                case 3: return [2];
            }
        });
    });
}
function printErrors(errors, filename) {
    var _a;
    for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
        var err = errors_1[_i];
        var location_1 = (_a = err.locations) === null || _a === void 0 ? void 0 : _a[0];
        var line = 0;
        var column = 0;
        if (location_1) {
            line = location_1.line;
            column = location_1.column;
        }
        console.error(err.message);
        console.error("  at " + (filename !== null && filename !== void 0 ? filename : '(string)') + ":" + line + ":" + column);
    }
}

exports.fromIntrospectionQuery = fromIntrospectionQuery;
exports.parseGraphQL = parseGraphQL;
//# sourceMappingURL=index.js.map
