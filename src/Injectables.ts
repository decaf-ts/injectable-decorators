import {
  Injectable,
  InjectableRegistryImp,
  InjectablesRegistry,
} from "./registry";

/**
 * @summary Static class Holding the access to the injectables functions
 *
 * @class Injectables
 * @static
 */
export class Injectables {
  private static actingInjectablesRegistry?: InjectablesRegistry = undefined;

  private constructor() {}

  /**
   * @summary Retrieves the named {@link Injectable} from the registry
   * @param {string} name
   * @param {any[]} args
   */
  static get<T>(name: string, ...args: any[]): Injectable<T> | undefined {
    return Injectables.getRegistry().get(name, ...args);
  }

  /**
   * @summary registers an injectable constructor
   * @param {Injectable} constructor
   * @param {any[]} args
   *
   */
  static register<T>(constructor: Injectable<T>, ...args: any[]): void {
    return Injectables.getRegistry().register(constructor, ...args);
  }

  /**
   * @summary Instantiates an Injectable
   * @param {Record<string, any>} obj
   * @param {any[]} args
   * @return T
   *
   */
  static build<T>(obj: Record<string, any>, ...args: any[]): T {
    return Injectables.getRegistry().build(obj, ...args);
  }

  /**
   * @summary Sets a new {@link InjectablesRegistry}
   * @param {InjectablesRegistry} operationsRegistry the new implementation of Registry
   */
  static setRegistry(operationsRegistry: InjectablesRegistry) {
    Injectables.actingInjectablesRegistry = operationsRegistry;
  }
  /**
   * @summary Returns the current {@link InjectablesRegistry}
   */
  private static getRegistry() {
    if (!Injectables.actingInjectablesRegistry)
      Injectables.actingInjectablesRegistry = new InjectableRegistryImp();
    return Injectables.actingInjectablesRegistry;
  }

  static reset() {
    this.setRegistry(new InjectableRegistryImp());
  }

  static selectiveReset(match: string | RegExp) {
    const regexp = typeof match === "string" ? new RegExp(match) : match;
    (Injectables.actingInjectablesRegistry as any)["cache"] = Object.entries(
      (Injectables.actingInjectablesRegistry as any)["cache"],
    ).reduce((accum: Record<string, any>, [key, val]) => {
      if (!key.match(regexp)) accum[key] = val;
      return accum;
    }, {});
  }
}
