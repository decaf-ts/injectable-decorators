import {
  Injectable,
  InjectableRegistryImp,
  InjectablesRegistry,
} from "./registry";
import { InjectableOptions } from "./types";

/**
 * @description Central registry for managing injectable dependencies.
 * @summary Static class holding the access to the injectables functions. Provides methods for registering,
 * retrieving, and building injectable objects.
 * @template T Type of the injectable object
 *
 * @class Injectables
 *
 * @example
 * // Define an injectable class
 * @injectable()
 * class MyService {
 *   doSomething() {
 *     return 'Hello World';
 *   }
 * }
 *
 * // Inject the service into another class
 * class MyComponent {
 *   @inject()
 *   private service!: MyService;
 *
 *   useService() {
 *     return this.service.doSomething();
 *   }
 * }
 *
 * @mermaid
 * sequenceDiagram
 *   participant Client
 *   participant Injectables
 *   participant Registry
 *
 *   Client->>Injectables: register(MyService)
 *   Injectables->>Registry: register(MyService)
 *   Registry-->>Injectables: void
 *
 *   Client->>Injectables: get("MyService")
 *   Injectables->>Registry: get("MyService")
 *   Registry-->>Injectables: MyService instance
 *   Injectables-->>Client: MyService instance
 */
export class Injectables {
  private static actingInjectablesRegistry?: InjectablesRegistry = undefined;

  private constructor() {}

  /**
   * @description Fetches an injectable instance by its registered name.
   * @summary Retrieves the named {@link Injectable} from the registry. If the injectable is a singleton,
   * returns the existing instance. Otherwise, creates a new instance.
   * @template T Type of the injectable object to retrieve
   * @param {string} name The registered name of the injectable to retrieve
   * @param {any[]} args Constructor arguments to pass when instantiating the injectable
   * @return {Injectable<T> | undefined} The injectable instance or undefined if not found
   */
  static get<T>(
    name: symbol | string | { new (...args: any[]): T },
    ...args: any[]
  ): T | undefined {
    return Injectables.getRegistry().get(name, ...args);
  }

  /**
   * @description Adds a class or object to the injectable registry.
   * @summary Registers an injectable constructor or instance with the registry, making it available for injection.
   * @template T Type of the injectable object to register
   * @param {Injectable<T>} constructor The class constructor or object instance to register
   * @param {any[]} args Additional arguments for registration (category, singleton flag, etc.)
   * @return {void}
   */
  static register<T>(constructor: Injectable<T>, ...args: any[]): void {
    return Injectables.getRegistry().register(
      constructor,
      ...(args as [symbol, InjectableOptions<T>])
    );
  }

  /**
   * @description Creates a new instance of an injectable class.
   * @summary Instantiates an injectable class using its constructor and the provided arguments.
   * @template T Type of the object to build
   * @param {symbol} name symbol referencing the injectable
   * @param {any[]} args Constructor arguments to pass when instantiating the injectable
   * @return {T} The newly created instance
   */
  static build<T>(name: symbol, ...args: any[]): T {
    return Injectables.getRegistry().build(name, ...args);
  }

  /**
   * @description Replaces the current registry implementation.
   * @summary Sets a new {@link InjectablesRegistry} implementation, allowing for custom registry behavior.
   * @param {InjectablesRegistry} operationsRegistry The new implementation of Registry to use
   * @return {void}
   */
  static setRegistry(operationsRegistry: InjectablesRegistry): void {
    Injectables.actingInjectablesRegistry = operationsRegistry;
  }
  /**
   * @description Provides access to the current registry instance.
   * @summary Returns the current {@link InjectablesRegistry} or creates a default one if none exists.
   * @return {InjectablesRegistry} The current registry instance
   */
  private static getRegistry(): InjectablesRegistry {
    if (!Injectables.actingInjectablesRegistry)
      Injectables.actingInjectablesRegistry = new InjectableRegistryImp();
    return Injectables.actingInjectablesRegistry;
  }

  /**
   * @description Clears all registered injectables.
   * @summary Resets the registry to a clean state by creating a new empty registry instance.
   * @return {void}
   */
  static reset(): void {
    Injectables.setRegistry(new InjectableRegistryImp());
  }

  /**
   * @description Removes specific injectables from the registry based on a pattern.
   * @summary Selectively resets the registry by removing only the injectables whose names match the provided pattern.
   * @param {string | RegExp} match A string or regular expression pattern to match against injectable names
   * @return {void}
   */
  static selectiveReset(match: string | RegExp): void {
    const regexp = typeof match === "string" ? new RegExp(match) : match;
    (Injectables.actingInjectablesRegistry as any)["cache"] = Object.entries(
      (Injectables.actingInjectablesRegistry as any)["cache"]
    ).reduce((accum: Record<string, any>, [key, val]) => {
      if (!key.match(regexp)) accum[key] = val;
      return accum;
    }, {});
  }
}
