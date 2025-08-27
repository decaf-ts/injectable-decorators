export type InstanceCallback<T> = (instance: T, ...args: any[]) => T;

export type InjectableOptions<T> = {
  singleton: boolean;
  callback: InstanceCallback<T>;
};

export type InjectableDef<
  T = any,
  OPTS extends InjectableOptions<T> = InjectableOptions<T>,
> = {
  options: OPTS;
  instance?: any;
  constructor: { new (...args: any[]): any };
};

export type InjectableMetadata = {
  class: string;
  symbol: symbol;
};
