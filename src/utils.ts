import "reflect-metadata";
import { getInjectKey } from "./decorators";
import { InjectablesKeys } from "./constants";

/**
 * @description Reflection metadata key for accessing TypeScript type information.
 * @summary Holds the key for retrieving the design type from TypeScript's reflection metadata.
 * @const TypeKey
 * @memberOf module:injectable-decorators
 */
export const TypeKey = "design:type";

/**
 * @description Extracts the type name from a decorated property using reflection.
 * @summary Retrieves the type from a property decorator by accessing TypeScript's reflection metadata.
 * @param {any} model The target object containing the decorated property
 * @param {string | symbol} propKey The property key (name or symbol) of the decorated property
 * @return {string | undefined} The name of the property type, or undefined if it's a Function type
 * @function getTypeFromDecorator
 * @memberOf module:injectable-decorators
 */
export function getTypeFromDecorator(
  model: any,
  propKey: string | symbol
): symbol | undefined {
  const typeDef = Reflect.getMetadata(TypeKey, model, propKey);
  if (typeDef.name === "Function") {
    return undefined;
  }
  const meta = Reflect.getMetadata(
    getInjectKey(InjectablesKeys.INJECTABLE),
    typeDef
  );
  if (!meta) {
    return undefined;
  }
  return meta.symbol;
}
