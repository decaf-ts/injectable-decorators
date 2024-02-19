/**
 * @summary Adds a simple Injectables implementation to create singleton instances of an object
 * and easily inject it into other objects
 *
 * @module injectable-decorators
 */

/**
 * @summary functions that decorate classes or class properties
 * @namespace Decorators
 * @memberOf module:injectable-decorators
 */

export * from './constants';
export * from './decorators';
export * from './registry';

/**
 * @summary Defined on library build. holds the library current version
 * @const VERSION
 * @memberOf module:injectable-decorators
 */
export const VERSION = "##VERSION##"