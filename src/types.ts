import { Constructor } from "@decaf-ts/decoration";

/**
 * @description Callback function type used to transform or initialize an instance after construction.
 * @summary Represents a post-construction hook that can modify or replace the created instance before it is returned to the caller.
 * @template T The instance type being produced and possibly transformed.
 * @param {T} instance The newly constructed instance.
 * @param {...any} args Additional arguments forwarded from the construction context.
 * @return {T} The instance to be stored/returned, which may be the original or a transformed instance.
 * @typedef InstanceCallback
 * @memberOf module:injectable-decorators
 */
export type InstanceCallback<T> = (instance: T, ...args: any[]) => T;

/**
 * @description Options controlling how an injectable should be handled by the registry.
 * @summary Specifies lifecycle and callback configuration for injectables, such as whether they are singletons and whether a post-build callback should run.
 * @template T The instance type governed by these options.
 * @property {boolean} singleton Indicates if the injectable should be treated as a singleton (single shared instance).
 * @property {InstanceCallback<T>} callback Optional callback invoked after building an instance to perform additional setup or transformation.
 * @typedef InjectableOptions
 * @memberOf module:injectable-decorators
 */
export type InjectableOptions<T> = {
  singleton: boolean;
  callback: InstanceCallback<T>;
};

/**
 * @description Internal registry definition for a stored injectable entry.
 * @summary Describes how the registry caches injectable metadata, constructor, and (optionally) a built instance.
 * @template T The resolved instance type.
 * @template OPTS The options shape used for this injectable, extending {@link InjectableOptions}.
 * @property {OPTS} options The lifecycle/options associated with this injectable entry.
 * @property {*} [instance] The cached instance when applicable (e.g., singleton), otherwise undefined until built.
 * @property {Constructor} constructor The constructor used to create new instances.
 * @typedef InjectableDef
 * @memberOf module:injectable-decorators
 */
export type InjectableDef<
  T = any,
  OPTS extends InjectableOptions<T> = InjectableOptions<T>,
> = {
  options: OPTS;
  instance?: any;
  constructor: Constructor<T>;
};

/**
 * @description Metadata attached to classes marked as injectable.
 * @summary Captures identifying information stored via reflection for later retrieval and wiring.
 * @property {string} class The class name of the injectable.
 * @property {symbol} symbol The unique symbol under which the injectable is registered.
 * @typedef InjectableMetadata
 * @memberOf module:injectable-decorators
 */
export type InjectableMetadata = {
  class: string;
  symbol: symbol;
};
