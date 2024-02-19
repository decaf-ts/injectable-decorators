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
import {getPropertyDecorators, ModelKeys} from "@tvenceslau/decorator-validation";

export function getTypeFromDecorator(model: any, propKey: string | symbol): string | undefined {
    const decorators: {prop: string | symbol, decorators: any[]} = getPropertyDecorators(ModelKeys.REFLECT, model, propKey, false);
    if (!decorators || !decorators.decorators)
        return;

    // TODO handle @type decorators. for now we stick with design:type
    const typeDecorator = decorators.decorators.shift();
    const name = typeDecorator.props ? typeDecorator.props.name : undefined;
    return name !== "Function" ? name : undefined;
}