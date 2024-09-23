import "reflect-metadata";

/**
 * @summary holds the key for the design type
 * @const TypeKey
 * @memberOf  module:injectable-decorators
 */
export const TypeKey = "design:type";

/**
 * @summary Retrieves the type from the decorators
 * @param {any} model
 * @param {string | symbol} propKey
 * @return {string | undefined}
 *
 * @function geTypeFromDecorators
 *
 * @memberOf module:injectable-decorators
 */
export function getTypeFromDecorator(
  model: any,
  propKey: string | symbol,
): string | undefined {
  const typeDef = Reflect.getMetadata(TypeKey, model, propKey);
  return typeDef.name !== "Function" ? typeDef.name : undefined;
}
