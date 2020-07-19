"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("lodash"),n=function(n){return e.has(n,"args")},t=function(n){return e.has(n,"defaultValue")},r=function(e){return"LIST"===e.kind},i=function(e){return"OBJECT"===e.kind},o=function(e){return"INPUT_OBJECT"===e.kind},u=function(e){return"ENUM"===e.kind},a=function(e){return"SCALAR"===e.kind},s=function(e){return"UNION"===e.kind},c=function(e){return"INTERFACE"===e.kind},p=function(e){return"NON_NULL"===e.kind},f=function(n,t){var r=t&&t.ignoreInternals;return e.filter(n,(function(n){return(i(n)&&!!n.fields||o(n)&&!!n.inputFields||u(n)&&!!n.enumValues||a(n)&&!!n.name||c(n)||s(n))&&(!r||r&&!e.startsWith(n.name,"__"))}))},d={Boolean:"boolean",String:"string",Int:"integer",Float:"number"},m=function(n){if(r(n))return{type:"array",items:m(n.ofType)};if(p(n))return m(n.ofType);var t=n.name;return e.includes(["OBJECT","INPUT_OBJECT","ENUM","SCALAR","INTERFACE","UNION"],n.kind)?e.includes(["OBJECT","INPUT_OBJECT","ENUM","INTERFACE","UNION"],n.kind)?{$ref:"#/definitions/"+t}:{$ref:"#/definitions/"+t,type:d[t]}:{type:d[t]}};function y(e){if(!e)return!0;try{return JSON.parse(e)}catch(n){return"INVALID_JSON: "+e}}function l(e){if(!e)return{};for(var n,t=/^\s*\+([a-z]([a-zA-z_])*)\(([^)]*)\)\s*$/gm,r="",i=0,o={},u=!1;null!==(n=t.exec(e));)r+=e.substring(i,n.index),n.index===t.lastIndex&&t.lastIndex++,i=t.lastIndex,o[n[1]]=y(n[3]),u=!0;0===i?r=e:i<e.length&&(r+=e.substring(i));var a={};return(r=r.replace(/^$|^\s+|\s+$|\n\n/gm,""))&&(a.description=r.trim()),u&&(a.__decorators=o),a}var _=function(n){return e.map(e.filter(n,(function(e){return p(e.type)&&!r(e.type.ofType)})),(function(e){return e.name}))},T=function(r,i){if(n(i)){var o=p(i.type)?m(i.type.ofType):m(i.type);r[i.name]={type:"object",properties:{return:o,arguments:{type:"object",properties:e.reduce(i.args,T,{}),required:_(i.args)}},required:[]}}else if(t(i)){o=p(i.type)?m(i.type.ofType):m(i.type);r[i.name]=o}return h(r,i),r},N=function(e,r){if(n(r)){var i=p(r.type)?m(r.type.ofType):m(r.type);e[r.name]=i}else if(t(r)){i=p(r.type)?m(r.type.ofType):m(r.type);e[r.name]=i}return h(e,r),e},I=function(n){return function(t,r){var p="definitions"===n?N:T;return i(r)?t[r.name]={type:"object",properties:e.reduce(r.fields,p,{}),required:"definitions"===n?_(r.fields):[]}:o(r)?t[r.name]={type:"object",properties:e.reduce(r.inputFields,p,{}),required:_(r.inputFields)}:c(r)?t[r.name]={type:"object",properties:e.reduce(r.fields,p,{}),required:"definitions"===n?_(r.fields):[]}:u(r)?(t[r.name]={type:"string",anyOf:r.enumValues.map((function(e){var n=l(e.description),t={enum:[e.name],title:n.description||e.name,description:n.description||void 0};return n.__decorators&&(t.__decorators=n.__decorators),t}))},h(t,r)):!function(n){return"SCALAR"===n.kind&&e.includes(["Boolean","String","Int","Float"],n.name)}(r)?a(r)?t[r.name]={type:"object",title:r.name}:s(r)&&(t[r.name]={type:"object",anyOf:r.possibleTypes.map((function(e){return{$ref:"#/definitions/"+e.name}}))}):t[r.name]={type:d[r.name],title:r.name},h(t,r),t}};function h(e,n){var t=n.name,r=l(n.description);r.description&&(e[t].description=r.description),r.__decorators&&(e[t].__decorators=r.__decorators)}exports.fromIntrospectionQuery=function(n,t){var r=t||{ignoreInternals:!0},o=n.__schema,u=o.queryType,a=o.mutationType;if(a){var s=n.__schema.types.find((function(e){return e.name==a.name}));s&&(n.__schema.types.Mutation=s,n.__schema.types.Mutation.name="Mutation")}if(u){var c=n.__schema.types.find((function(e){return e.name==u.name}));c&&(n.__schema.types.Query=c,n.__schema.types.Query.name="Query")}var p=e.partition(n.__schema.types,(function(n){return i(n)&&e.includes(["Query","Mutation"],n.name)})),d=p[0],m=p[1];return{$schema:"http://json-schema.org/draft-06/schema#",properties:e.reduce(d,I("properties"),{}),definitions:e.reduce(f(m,r),I("definitions"),{})}};
//# sourceMappingURL=index.js.map