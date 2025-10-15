import { Constructor, Metadata } from "@decaf-ts/decoration";
import { InjectablesKeys } from "./constants";
import { InjectOptions } from "./decorators";

(Metadata as any).injectables = function <
  T extends string | symbol | Constructor,
>(
  category?: T
): (T extends undefined ? Constructor[] : Constructor) | undefined {
  const meta = Metadata["innerGet"](Symbol.for(InjectablesKeys.INJECTABLE));
  if (!meta) return undefined;
  if (!category) return meta;
  let symbol: symbol;
  if (typeof category !== "symbol") {
    if (typeof category === "string") symbol = Symbol.for(category);
    else symbol = Metadata.Symbol(Metadata.constr(category) || category);
  } else {
    symbol = category;
  }
  return meta[symbol];
};

(Metadata as any).injected = function <T, K extends keyof T>(
  model: Constructor<T>,
  prop?: K
): (K extends keyof T ? InjectOptions : Record<K, InjectOptions>) | undefined {
  const meta = Metadata.get(
    model,
    `${InjectablesKeys.INJECT}${prop ? `${Metadata.splitter}${prop.toString()}` : ""}`
  );
  return meta as K extends keyof T ? InjectOptions : Record<K, InjectOptions>;
};
