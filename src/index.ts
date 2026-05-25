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

/**
 * @description Represents the current commit hash of the module build.
 * @summary Stores the current git commit hash for the package. The build replaces
 * the placeholder with the actual commit hash at publish time.
 * @const COMMIT
 */
export const COMMIT = "##COMMIT##";

/**
 * @description Represents the full version string of the module.
 * @summary Stores the semver version and commit hash for the package.
 * The build replaces the placeholder with the actual `<version>-<commit>` value at publish time.
 * @const FULL_VERSION
 */
export const FULL_VERSION = "##FULL_VERSION##";

export const PACKAGE_NAME = "##PACKAGE##";
Metadata.registerLibrary(PACKAGE_NAME, VERSION);
