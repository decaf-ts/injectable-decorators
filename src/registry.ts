/**
 * @description Type representing either a class constructor or an instance.
 * @summary Defines an Injectable type that can be either a class constructor or an instance of a class.
 * @template T The type of the injectable object
 * @typedef {function(any): T | T} Injectable
 * @memberOf module:injectable-decorators
 */
export type Injectable<T> = { new (...args: any[]): T } | T;

/**
 * @description Contract for a registry that manages injectable objects.
 * @summary Interface for an injectable registry that provides methods for retrieving, registering, and building injectable objects.
 * @template T Type parameter used in the interface methods
 * @interface InjectablesRegistry
 * @memberOf module:injectable-decorators
 */
export interface InjectablesRegistry {
  /**
   * @description Fetches an injectable instance by its registered name.
   * @summary Retrieves an {@link Injectable} from the registry by name, optionally passing constructor arguments.
   * @template T Type of the injectable object to retrieve
   * @param {string} name The registered name of the injectable to retrieve
   * @param {any[]} args Constructor arguments to pass when instantiating the injectable
   * @return {Injectable<T> | undefined} The injectable instance or undefined if not found
   * @memberOf module:injectable-decorators
   */
  get<T>(name: string, ...args: any[]): Injectable<T> | undefined;

  /**
   * @description Adds a class or object to the injectable registry.
   * @summary Registers an injectable constructor or instance with the registry, making it available for injection.
   * @template T Type of the injectable object to register
   * @param {Injectable<T>} constructor The class constructor or object instance to register
   * @param {any[]} args Additional arguments for registration (category, singleton flag, etc.)
   * @return {void}
   * @memberOf module:injectable-decorators
   */
  register<T>(constructor: Injectable<T>, ...args: any[]): void;

  /**
   * @description Creates a new instance of an injectable class.
   * @summary Instantiates an injectable class using its constructor and the provided arguments.
   * @template T Type of the object to build
   * @param {Record<string, any>} obj Object containing the name of the injectable to build
   * @param {any[]} args Constructor arguments to pass when instantiating the injectable
   * @return {T} The newly created instance
   * @memberOf module:injectable-decorators
   */
  build<T>(obj: Record<string, any>, ...args: any[]): T;
}

/**
 * @description Default implementation of the InjectablesRegistry interface.
 * @summary Holds the various {@link Injectable}s in a cache and provides methods to register, retrieve, and build them.
 * @template T Type parameter used in the class methods
 *
 * @class InjectableRegistryImp
 * @implements InjectablesRegistry
 *
 * @memberOf module:injectable-decorators
 *
 * @example
 * // Create a new registry
 * const registry = new InjectableRegistryImp();
 *
 * // Register a class
 * class MyService {
 *   doSomething() {
 *     return 'Hello World';
 *   }
 * }
 * registry.register(MyService, 'MyService', true);
 *
 * // Get the instance
 * const service = registry.get('MyService');
 * service.doSomething(); // 'Hello World'
 *
 * @mermaid
 * sequenceDiagram
 *   participant Client
 *   participant Registry
 *
 *   Client->>Registry: register(MyService)
 *   Registry->>Registry: Store in cache
 *
 *   Client->>Registry: get("MyService")
 *   alt Instance exists and is singleton
 *     Registry-->>Client: Return cached instance
 *   else No instance or not singleton
 *     Registry->>Registry: build(name)
 *     Registry-->>Client: Return new instance
 *   end
 */
export class InjectableRegistryImp implements InjectablesRegistry {
  private cache: { [indexer: string]: any } = {};

  /**
   * @inheritDoc
   */
  get<T>(name: string, ...args: any[]): T | undefined {
    try {
      const innerCache = this.cache[name];
      const buildDef = { name: name };
      if (!innerCache.singleton && !innerCache.instance)
        return this.build<T>(buildDef, ...args);
      return innerCache.instance || this.build<T>(buildDef, ...args);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return undefined;
    }
  }
  /**
   * @inheritDoc
   */
  register<T>(
    obj: Injectable<T>,
    category: string | undefined = undefined,
    isSingleton: boolean = true,
    force: boolean = false
  ): void {
    const castObj: Record<string, any> = obj as Record<string, any>;

    const constructor = !castObj.name && castObj.constructor;
    if (typeof castObj !== "function" && !constructor)
      throw new Error(
        `Injectable registering failed. Missing Class name or constructor`
      );

    const name =
      category ||
      (constructor && constructor.name && constructor.name !== "Function"
        ? (constructor as { [indexer: string]: any }).name
        : castObj.name);

    if (!this.cache[name] || force)
      this.cache[name] = {
        instance: constructor ? obj : undefined,
        constructor: !constructor ? obj : undefined,
        singleton: isSingleton,
      };
  }
  /**
   * @inheritDoc
   */
  build<T>(defs: { name: string }, ...args: any[]): T {
    const { constructor, singleton } = this.cache[defs.name];
    const instance = new constructor(...args);
    this.cache[defs.name] = {
      instance: instance,
      constructor: constructor,
      singleton: singleton,
    };
    return instance;
  }
}
