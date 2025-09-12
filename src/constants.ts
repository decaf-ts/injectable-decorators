import { InjectableConfig } from "./decorators";

/**
 * @description Constants used for reflection metadata keys in the dependency injection system.
 * @summary Injectables Reflection keys used to store and retrieve metadata about injectable classes and properties.
 * @property {string} REFLECT Reflection injectables base key prefix for all metadata keys
 * @property {string} INJECTABLE Reflection key suffix for marking a class as injectable
 * @property {string} INJECT Reflection key suffix for marking a property for injection
 * @const InjectablesKeys
 * @memberOf module:injectable-decorators
 */
export const InjectablesKeys = {
  REFLECT: "inject.db.",
  INJECTABLE: "injectable",
  INJECT: "inject",
};

/**
 * @description Default configuration applied by the @injectable decorator when none is provided.
 * @summary Sets sensible defaults such as singleton lifecycle for newly registered injectables.
 * @const DefaultInjectablesConfig
 * @memberOf module:injectable-decorators
 */
export const DefaultInjectablesConfig: InjectableConfig = {
  singleton: true,
};

/**
 * @description Reflection metadata key for accessing TypeScript type information.
 * @summary Holds the key for retrieving the design type from TypeScript's reflection metadata.
 * @const TypeKey
 * @memberOf module:injectable-decorators
 */
export const TypeKey = "design:type";
