import { DefaultInjectablesConfig, InjectablesKeys } from "./constants";
import { Injectables } from "./Injectables";
import { getInjectKey, getTypeFromDecorator } from "./utils";
import { InjectableMetadata, InstanceCallback } from "./types";

export type InjectableConfig = {
  singleton: boolean;
  callback?: InstanceCallback<any>;
};

/**
 * @description Decorator that marks a class as available for dependency injection.
 * @summary Defines a class as an injectable that can be retrieved from the registry.
 * When applied to a class, replaces its constructor with one that returns an instance.
 *
 * @return A decorator function that transforms the class into an injectable.
 */
export function injectable(): (original: any) => any;
/**
 * @description Decorator that marks a class as available for dependency injection.
 * @summary Defines a class as an injectable that can be retrieved from the registry.
 * When applied to a class, replaces its constructor with one that returns an instance.
 *
 * @param category Defaults to the class category. Useful when minification occurs and names are changed,
 * or when you want to upcast the object to a different type.
 *
 * @return A decorator function that transforms the class into an injectable.
 */
export function injectable(
  category: string | { new (...args: any[]): any }
): (original: any) => any;
/**
 * @description Decorator that marks a class as available for dependency injection.
 * @summary Defines a class as an injectable that can be retrieved from the registry.
 * When applied to a class, replaces its constructor with one that returns an instance.
 *
 * @param {Partial<InjectableConfig>} cfg=DefaultInjectableConfig Allows overriding the default singleton behavior and adding a callback function.
 *
 * @return A decorator function that transforms the class into an injectable.
 */
export function injectable(
  cfg: Partial<InjectableConfig>
): (original: any) => any;

/**
 * @description Decorator that marks a class as available for dependency injection.
 * @summary Defines a class as an injectable that can be retrieved from the registry.
 * When applied to a class, replaces its constructor with one that returns an instance.
 *
 * @param category Defaults to the class category. Useful when minification occurs and names are changed,
 * or when you want to upcast the object to a different type.
 * @param {Partial<InjectableConfig>} cfg=DefaultInjectableConfig Allows overriding the default singleton behavior and adding a callback function.
 *
 * @return A decorator function that transforms the class into an injectable.
 */
export function injectable(
  category: string | { new (...args: any[]): any },
  cfg: Partial<InjectableConfig>
): (original: any) => any;
/**
 * @description Decorator that marks a class as available for dependency injection.
 * @summary Defines a class as an injectable that can be retrieved from the registry.
 * When applied to a class, replaces its constructor with one that returns an instance.
 *
 * @param [category] Defaults to the class category. Useful when minification occurs and names are changed,
 * or when you want to upcast the object to a different type.
 * @param {Partial<InjectableConfig>} [cfg=DefaultInjectableConfig] Allows overriding the default singleton behavior and adding a callback function.
 *
 * @return A decorator function that transforms the class into an injectable.
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
 *   Decorator->>Injectables: get(category)
 *   alt Instance exists
 *     Injectables-->>Decorator: Return existing instance
 *   else No instance
 *     Decorator->>Injectables: register(original, category)
 *     Decorator->>Injectables: get(category)
 *     Injectables-->>Decorator: Return new instance
 *     opt Has callback
 *       Decorator->>Decorator: Call instanceCallback
 *     end
 *   end
 *   Decorator->>Decorator: Define metadata
 *   Decorator-->>Client: Return instance
 */
export function injectable(
  category?: string | { new (...args: any[]): any } | Partial<InjectableConfig>,
  cfg?: Partial<InjectableConfig>
) {
  cfg =
    cfg ||
    (typeof category === "object"
      ? Object.assign(category as Record<any, any>, DefaultInjectablesConfig)
      : DefaultInjectablesConfig);
  category =
    typeof category === "object"
      ? undefined
      : typeof category === "string"
        ? category
        : typeof category === "function" && category.name
          ? category
          : undefined;

  return (original: any) => {
    const symbol = Symbol.for(category || original.toString());
    category = category || original.name;

    const metadata: InjectableMetadata = {
      class: category as string,
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

    Reflect.defineMetadata(
      getInjectKey(InjectablesKeys.INJECTABLE),
      metadata,
      newConstructor
    );

    Injectables.register(original, symbol, cfg);
    // return new constructor (will override original)
    return newConstructor;
  };
}

export function singleton(
  category?: string | { new (...args: any[]): any },
  cfg?: Omit<InjectableConfig, "singleton">
) {
  return injectable(
    category as any,
    Object.assign({}, cfg || {}, { singleton: true })
  );
}

export function onDemand(
  category?: string | { new (...args: any[]): any },
  cfg?: Omit<InjectableConfig, "singleton">
) {
  return injectable(
    category as any,
    Object.assign({}, cfg || {}, { singleton: false })
  );
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

export type InjectOptions = {
  args?: any[];
  transformer?: InstanceTransformer;
};

/**
 * @description Property decorator that injects a dependency into a class property.
 * @summary Allows for the injection of an {@link injectable} decorated dependency into a class property.
 * The property must be typed for the requested dependency. Only concrete classes are supported; generics are not.
 *
 * @return {Function} A property decorator function that sets up the dependency injection.
 */
export function inject(): (target: any, propertyKey: any) => void;
/**
 * @description Property decorator that injects a dependency into a class property.
 * @summary Allows for the injection of an {@link injectable} decorated dependency into a class property.
 * The property must be typed for the requested dependency. Only concrete classes are supported; generics are not.
 *
 * @param {string} category Defaults to the class name derived from the property type. Useful when minification occurs
 * and names are changed, or when you want to upcast the object to a different type.
 * @return {Function} A property decorator function that sets up the dependency injection.
 */
export function inject(
  category: string | { new (...args: any[]): any }
): (target: any, propertyKey: any) => void;
/**
 * @description Property decorator that injects a dependency into a class property.
 * @summary Allows for the injection of an {@link injectable} decorated dependency into a class property.
 * The property must be typed for the requested dependency. Only concrete classes are supported; generics are not.
 *
 * @param {Partial<InjectOptions} [cfg={}] Optional function to transform the injectable instance before it's injected, or arguments to pass the constructor when injecting onDemand * @return {Function} A property decorator function that sets up the dependency injection.
 */
export function inject(
  cfg: Partial<InjectOptions>
): (target: any, propertyKey: any) => void;
/**
 * @description Property decorator that injects a dependency into a class property.
 * @summary Allows for the injection of an {@link injectable} decorated dependency into a class property.
 * The property must be typed for the requested dependency. Only concrete classes are supported; generics are not.
 *
 * @param {string} category Defaults to the class name derived from the property type. Useful when minification occurs
 * and names are changed, or when you want to upcast the object to a different type.
 * @param {Partial<InjectOptions} cfg={} Optional function to transform the injectable instance before it's injected, or arguments to pass the constructor when injecting onDemand * @return {Function} A property decorator function that sets up the dependency injection.
 */
export function inject(
  category: string | { new (...args: any[]): any },
  cfg: Partial<InjectOptions>
): (target: any, propertyKey: any) => void;
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
 * @param {Partial<InjectOptions} [cfg={}] Optional function to transform the injectable instance before it's injected, or arguments to pass the constructor when injecting onDemand
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
  category?:
    | symbol
    | string
    | { new (...args: any[]): any }
    | Partial<InjectOptions>,
  cfg?: Partial<InjectOptions>
) {
  return (target: any, propertyKey: any) => {
    const config: InjectOptions = (
      cfg || typeof category === "object" ? category : {}
    ) as InjectOptions;

    const name: symbol | string | { new (...args: any[]): any } | undefined =
      (typeof category !== "object" &&
        (category as symbol | string | { new (...args: any[]): any })) ||
      getTypeFromDecorator(target, propertyKey);
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

    const values = new WeakMap();

    Object.defineProperty(target, propertyKey, {
      configurable: true,
      get(this: any) {
        const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
          target,
          propertyKey
        ) as PropertyDescriptor;
        if (descriptor.configurable) {
          // let /obj: any;
          Object.defineProperty(this, propertyKey, {
            enumerable: true,
            configurable: false,
            get(this: any) {
              let obj = values.get(this);
              if (obj) return obj;
              obj = Injectables.get(name, ...(config.args || []));
              if (!obj)
                throw new Error(
                  `Could not get Injectable ${name.toString()} to inject in ${target.constructor ? target.constructor.name : target.name}'s ${propertyKey}`
                );
              if (config.transformer)
                try {
                  obj = config.transformer(obj, target);
                } catch (e) {
                  console.error(e);
                }
              values.set(this, obj);

              return obj;
            },
          });
          return this[propertyKey];
        }
      },
    });
  };
}
