import { InjectablesKeys } from "./constants";

/**
 * @description Generates a fully qualified reflection metadata key.
 * @summary Returns the reflection key for injectables by prefixing the provided key with the base reflection key.
 * @param {string} key The key to be prefixed
 * @return {string} The fully qualified reflection key
 * @function getInjectKey
 * @memberOf module:injectable-decorators
 */
export const getInjectKey = (key: string) => InjectablesKeys.REFLECT + key;
