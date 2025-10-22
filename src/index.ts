/**
 * @description A lightweight dependency injection library for TypeScript applications.
 * @summary Adds a simple Injectables implementation to create singleton instances of an object
 * and easily inject it into other objects. Provides decorators for marking classes as injectable
 * and for injecting dependencies into class properties.
 *
 * @module injectable-decorators
 */

import { Metadata } from "@decaf-ts/decoration";

export * from "./constants";
export * from "./decorators";
export * from "./Injectables";
export * from "./registry";
export * from "./types";
export * from "./utils";

/**
 * @description Current version of the injectable-decorators library.
 * @summary Defined on library build. Holds the library's current version string.
 * @const VERSION
 * @memberOf module:injectable-decorators
 */
export const VERSION = "##VERSION##";
export const PACKAGE_NAME = "##PACKAGE_NAME##";
Metadata.registerLibrary(PACKAGE_NAME, VERSION);
