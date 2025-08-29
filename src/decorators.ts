import { InjectablesKeys } from "./constants";
import { Injectables } from "./Injectables";
import { getTypeFromDecorator } from "./utils";
import {
  InjectableMetadata,
  InjectableOptions,
  InstanceCallback,
} from "./types";

/**
 * @description Generates a fully qualified reflection metadata key.
 * @summary Returns the reflection key for injectables by prefixing the provided key with the base reflection key.
 * @param {string} key The key to be prefixed
 * @return {string} The fully qualified reflection key
 * @function getInjectKey
 * @memberOf module:injectable-decorators
 */
export const getInjectKey = (key: string) => InjectablesKeys.REFLECT + key;

/**
 * @description Decorator that marks a class as available for dependency injection.
 * @summary Defines a class as an injectable singleton that can be retrieved from the registry.
 * When applied to a class, replaces its constructor with one that returns a singleton instance.
 *
 * @param {string} [category] Defaults to the class name. Useful when minification occurs and names are changed,
 * or when you want to upcast the object to a different type.
 * @param {boolean} [force] Defines if the injectable should override an already existing instance (if any).
 * Only meant for extending decorators.
 * @param {Function} [instanceCallback] Optional callback function that will be called with the instance after creation.
 * @return {Function} A decorator function that transforms the class into an injectable.
 *
 * @function injectable
 * @category Class Decorators
 *
 * @mermaid
 * sequenceDiagram
 *   participant Client
 *   participant Decorator
 *   participant Injectables
 *
 *   Client->>Decorator: @injectable()
 *   Decorator->>Decorator: Create new constructor
 *
 *   Note over Decorator: When new instance requested
 *   Decorator->>Injectables: get(name)
 *   alt Instance exists
 *     Injectables-->>Decorator: Return existing instance
 *   else No instance
 *     Decorator->>Injectables: register(original, name)
 *     Decorator->>Injectables: get(name)
 *     Injectables-->>Decorator: Return new instance
 *     opt Has callback
 *       Decorator->>Decorator: Call instanceCallback
 *     end
 *   end
 *   Decorator->>Decorator: Define metadata
 *   Decorator-->>Client: Return instance
 */
export function injectable(): (original: any) => any;
export function injectable(
  category: string | { new (...args: any[]): any }
): (original: any) => any;
export function injectable(
  instanceCallback: InstanceCallback<any>
): (original: any) => any;
export function injectable(
  category: string | { new (...args: any[]): any },
  instanceCallback: InstanceCallback<any>
): (original: any) => any;
export function injectable(
  name?: string | { new (...args: any[]): any } | InstanceCallback<any>,
  cb?: InstanceCallback<any>
) {
  const instanceCallback = (
    typeof name === "function" && !name.name ? name : cb
  ) as InstanceCallback<any> | undefined;
  const category =
    typeof name === "string"
      ? name
      : cb
        ? name
        : typeof name === "function" && !name.name
          ? undefined
          : name;

  return (original: any) => {
    const symbol = Symbol.for(category || original.toString());
    const name = category || original.name;

    const metadata: InjectableMetadata = {
      class: name,
      symbol: symbol,
    };

    Reflect.defineMetadata(
      getInjectKey(InjectablesKeys.INJECTABLE),
      metadata,
      original
    );
    // the new constructor behaviour
    const newConstructor: any = function (...args: any[]) {
      return Injectables.get<any>(symbol, ...args);
    };

    // copy prototype so instanceof operator still works
    newConstructor.prototype = original.prototype;
    // newConstructor.__proto__ = original.__proto__;
    // Sets the proper constructor name for type verification
    Object.defineProperty(newConstructor, "name", {
      writable: false,
      enumerable: true,
      configurable: false,
      value: original.prototype.constructor.name,
    });

    const opts: InjectableOptions<any> = {
      singleton: true,
      callback: instanceCallback as InstanceCallback<any>,
    };

    Reflect.defineMetadata(
      getInjectKey(InjectablesKeys.INJECTABLE),
      metadata,
      newConstructor
    );

    Injectables.register(original, symbol, opts);
    // return new constructor (will override original)
    return newConstructor;
  };
}
/**
 * @description Function type for transforming injectable instances before they're injected.
 * @summary Function which transforms a cached {@link injectable} instance before it's injected into a target object.
 *
 * @param {any} injectable The injectable instance to transform
 * @param {any} obj The object the injectable will be injected on
 * @return {any} The transformed injectable instance
 *
 * @typedef {Function} InstanceTransformer
 * @memberOf module:injectable-decorators
 */
export type InstanceTransformer = (injectable: any, obj: any) => any;

/**
 * @description Property decorator that injects a dependency into a class property.
 * @summary Allows for the injection of an {@link injectable} decorated dependency into a class property.
 * The property must be typed for the requested dependency. Only concrete classes are supported; generics are not.
 *
 * Injected properties should be described like so:
 * <pre>
 *     class ClassName {
 *         ...
 *
 *         @inject()
 *         propertyName!: InjectableClass;
 *
 *         ...
 *     }
 * </pre>
 *
 * where InjectableClass is the class you want to inject.
 * Notice the use of '!:' to ensure the transpiler the property will be set outside the constructor but will always be defined.
 * For projects where minification occurs, you should use the category param to ensure the name is the same throughout.
 *
 * @param {string} [category] Defaults to the class name derived from the property type. Useful when minification occurs
 * and names are changed, or when you want to upcast the object to a different type.
 * @param {InstanceTransformer} [transformer] Optional function to transform the injectable instance before it's injected.
 * @return {Function} A property decorator function that sets up the dependency injection.
 *
 * @function inject
 * @category Property Decorators
 *
 * @mermaid
 * sequenceDiagram
 *   participant Client
 *   participant Decorator
 *   participant Injectables
 *
 *   Client->>Decorator: @inject()
 *   Decorator->>Decorator: Get type from property
 *   Decorator->>Decorator: Define metadata
 *   Decorator->>Decorator: Define property getter
 *
 *   Note over Decorator: When property accessed
 *   Client->>Decorator: access property
 *   Decorator->>Decorator: Check if instance exists
 *   alt Instance exists in WeakMap
 *     Decorator-->>Client: Return cached instance
 *   else No instance
 *     Decorator->>Injectables: get(name)
 *     alt Injectable found
 *       Injectables-->>Decorator: Return injectable instance
 *       opt Has transformer
 *         Decorator->>Decorator: Call transformer
 *       end
 *       Decorator->>Decorator: Store in WeakMap
 *       Decorator-->>Client: Return instance
 *     else No injectable
 *       Decorator-->>Client: Throw error
 *     end
 *   end
 */
export function inject(
  category?: symbol | string | { new (...args: any[]): any },
  transformer?: InstanceTransformer,
  ...args: any[]
) {
  return (target: any, propertyKey?: any) => {
    const values = new WeakMap();

    const name: symbol | string | { new (...args: any[]): any } | undefined =
      category || getTypeFromDecorator(target, propertyKey);
    if (!name) {
      throw new Error(`Could not get Type from decorator`);
    }

    Reflect.defineMetadata(
      getInjectKey(InjectablesKeys.INJECT),
      {
        injectable: name,
      },
      target,
      propertyKey
    );

    Object.defineProperty(target, propertyKey, {
      configurable: true,
      get(this: any) {
        const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
          target,
          propertyKey
        ) as PropertyDescriptor;
        if (descriptor.configurable) {
          Object.defineProperty(this, propertyKey, {
            enumerable: true,
            configurable: false,
            get(this: any) {
              let obj = values.get(this);
              if (!obj) {
                obj = Injectables.get(name, ...args);
                if (!obj)
                  throw new Error(
                    `Could not get Injectable ${name.toString()} to inject in ${target.constructor ? target.constructor.name : target.name}'s ${propertyKey}`
                  );
                if (transformer)
                  try {
                    obj = transformer(obj, target);
                  } catch (e) {
                    console.error(e);
                  }
                values.set(this, obj);
              }
              return obj;
            },
          });
          return this[propertyKey];
        }
      },
    });
  };
}
