/**
 * @summary defines an Injectable type
 * @memberOf module:injectable-decorators
 */
export type Injectable<T> = { new (...args: any[]): T } | T;

/**
 * @summary Interface for an injectable registry
 * @interface InjectableRegistry
 */
export interface InjectablesRegistry {
  /**
   * @summary retrieves an {@link Injectable}
   * @param {string} name
   * @param {any[]} args
   * @return {Injectable | undefined}
   *
   * @method
   */
  get<T>(name: string, ...args: any[]): Injectable<T> | undefined;

  /**
   * @summary registers an injectable constructor
   * @param {Injectable} constructor
   * @param {any[]} args
   *
   * @method
   */
  register<T>(constructor: Injectable<T>, ...args: any[]): void;

  /**
   * @summary Instantiates an Injectable
   * @param {Record<string, any>} obj
   * @param {any[]} args
   * @return T
   *
   * @method
   */
  build<T>(obj: Record<string, any>, ...args: any[]): T;
}

/**
 * @summary Holds the vairous {@link Injectable}s
 * @class InjectableRegistryImp
 * @implements InjectablesRegistry
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
    force: boolean = false,
  ): void {
    const castObj: Record<string, any> = obj as Record<string, any>;

    const constructor = !castObj.name && castObj.constructor;
    if (typeof castObj !== "function" && !constructor)
      throw new Error(
        `Injectable registering failed. Missing Class name or constructor`,
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
