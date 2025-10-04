import type { Constructor } from "@decaf-ts/decoration";
import { InjectOptions } from "./decorators";

declare module "@decaf-ts/decoration" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Metadata {
    function injectables<T extends string | symbol | Constructor>(
      category?: T
    ): (T extends undefined ? Constructor[] : Constructor) | undefined;

    function injected<T, K extends keyof T>(
      model: T | Constructor<T>,
      prop?: K
    ):
      | (K extends keyof T ? InjectOptions : Record<K, InjectOptions>)
      | undefined;
  }
}
