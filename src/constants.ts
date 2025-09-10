import { InjectableConfig } from "./decorators";

/**
 * @description Constants used for reflection metadata keys in the dependency injection system.
 * @summary Injectables Reflection keys used to store and retrieve metadata about injectable classes and properties.
 *
 * @property {string} REFLECT Reflection injectables base key prefix for all metadata keys
 * @property {string} INJECTABLE Reflection key suffix for marking a class as injectable
 * @property {string} INJECT Reflection key suffix for marking a property for injection
 *
 * @const InjectablesKeys
 * @memberOf module:injectable-decorators
 */
export const InjectablesKeys = {
  REFLECT: "inject.db.",
  INJECTABLE: "injectable",
  INJECT: "inject",
};

export const DefaultInjectablesConfig: InjectableConfig = {
  singleton: true,
};
