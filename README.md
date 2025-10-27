![Banner](./workdocs/assets/decaf-logo.svg)
## Simple Injectables engine

A lightweight TypeScript dependency injection library that provides decorators for marking classes as injectable singletons and injecting dependencies into class properties. It features a centralized registry for managing dependencies, lazy loading of injected properties, and support for custom transformations of injected instances.

![Licence](https://img.shields.io/github/license/decaf-ts/injectable-decorators.svg?style=plastic)
![GitHub language count](https://img.shields.io/github/languages/count/decaf-ts/injectable-decorators?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/decaf-ts/injectable-decorators?style=plastic)

[![Build & Test](https://github.com/decaf-ts/injectable-decorators/actions/workflows/nodejs-build-prod.yaml/badge.svg)](https://github.com/decaf-ts/injectable-decorators/actions/workflows/nodejs-build-prod.yaml)
[![CodeQL](https://github.com/decaf-ts/injectable-decorators/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/decaf-ts/injectable-decorators/actions/workflows/codeql-analysis.yml)[![Snyk Analysis](https://github.com/decaf-ts/injectable-decorators/actions/workflows/snyk-analysis.yaml/badge.svg)](https://github.com/decaf-ts/injectable-decorators/actions/workflows/snyk-analysis.yaml)
[![Pages builder](https://github.com/decaf-ts/injectable-decorators/actions/workflows/pages.yaml/badge.svg)](https://github.com/decaf-ts/injectable-decorators/actions/workflows/pages.yaml)
[![.github/workflows/release-on-tag.yaml](https://github.com/decaf-ts/injectable-decorators/actions/workflows/release-on-tag.yaml/badge.svg?event=release)](https://github.com/decaf-ts/injectable-decorators/actions/workflows/release-on-tag.yaml)

![Open Issues](https://img.shields.io/github/issues/decaf-ts/injectable-decorators.svg)
![Closed Issues](https://img.shields.io/github/issues-closed/decaf-ts/injectable-decorators.svg)
![Pull Requests](https://img.shields.io/github/issues-pr-closed/decaf-ts/injectable-decorators.svg)
![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)

![Forks](https://img.shields.io/github/forks/decaf-ts/injectable-decorators.svg)
![Stars](https://img.shields.io/github/stars/decaf-ts/injectable-decorators.svg)
![Watchers](https://img.shields.io/github/watchers/decaf-ts/injectable-decorators.svg)

![Node Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbadges%2Fshields%2Fmaster%2Fpackage.json&label=Node&query=$.engines.node&colorB=blue)
![NPM Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbadges%2Fshields%2Fmaster%2Fpackage.json&label=NPM&query=$.engines.npm&colorB=purple)

Documentation available [here](https://decaf-ts.github.io/injectable-decorators/)

Minimal size: 1.4 KB kb gzipped


### Description

The `injectable-decorators` library is a standalone module that provides a lightweight and flexible dependency injection system for TypeScript applications. It is designed to simplify the management of dependencies between components in your application through the use of TypeScript decorators.

#### Core Components

1. **Injectables Registry**
   - The central component that manages all injectable objects
   - Maintains a cache of singleton instances
   - Provides methods for registering, retrieving, and building injectable objects
   - Can be customized with a different implementation if needed

2. **Decorators**
   - `@injectable()`: Class decorator that marks a class as available for dependency injection
     - Transforms the class into a singleton that can be retrieved from the registry
     - Supports optional category naming for minification safety
     - Allows for custom callbacks after instance creation
   - `@inject()`: Property decorator that injects a dependency into a class property
     - Automatically resolves the dependency type from TypeScript's type system
     - Supports custom transformers to modify the injected instance
     - Implements lazy loading - dependencies are only instantiated when accessed

3. **Reflection Utilities**
   - Uses TypeScript's reflection metadata to determine property types
   - Provides utilities for working with type information in decorators

#### Key Features

- **Singleton Management**: Injectables are typically managed as singletons, ensuring consistent state across your application.
- **Lazy Loading**: Dependencies are only instantiated when they are actually accessed, simplifying the injection order and improving performance.
- **Type Safety**: Leverages TypeScript's type system to ensure type safety in injected dependencies.
- **Minification Support**: Provides options to specify explicit names for injectables to handle minification scenarios.
- **Custom Transformations**: Supports transforming injectable instances before they're injected into target objects.
- **Selective Reset**: Ability to selectively reset specific injectables in the registry based on name patterns.

#### Design Philosophy

The library follows a minimalist approach, focusing on providing essential dependency injection capabilities without unnecessary complexity. It's designed to be:

- **Lightweight**: Small footprint with minimal dependencies
- **Flexible**: Adaptable to different application architectures
- **Intuitive**: Simple API that follows natural TypeScript patterns
- **Non-intrusive**: Minimal impact on your existing code structure

Unlike more complex DI frameworks, this library doesn't require extensive configuration or setup. The developer is responsible for initially decorating classes and properties, but the library handles the instantiation and injection process automatically.


### How to Use

- See Initial Setup and Installation in: ./workdocs/tutorials/For Developers.md

## Basic Usage Examples

### 1) Mark a class as injectable and get it from the registry

Description: Define a class with @injectable() so it becomes available through the central registry. Creating with new returns the instance managed by the registry.

```typescript
import 'reflect-metadata';
import { injectable, Injectables } from 'injectable-decorators';

@injectable()
class InitialObject {
  doSomething() { return 5; }
}

const obj = new InitialObject();
const same = Injectables.get(InitialObject);
// obj and same refer to the same instance (singleton by default)
```

### 2) Inject a dependency into a property

Description: Use @inject() on a typed property. The instance is created lazily when the property is first accessed and cached thereafter.

```typescript
import 'reflect-metadata';
import { injectable, inject, Injectables } from 'injectable-decorators';

@injectable()
class SomeService { value = 5; }

class Controller {
  @inject()
  service!: SomeService; // non-null assertion because it's set outside the constructor
}

const c = new Controller();
console.log(c.service.value); // 5
console.log(c.service === Injectables.get(SomeService)); // true
```

### 3) Use a custom category (string) for minification or upcasting

Description: Provide a stable name when class names may change (e.g., minification) or to upcast through a base type.

```typescript
import 'reflect-metadata';
import { injectable, inject, singleton } from 'injectable-decorators';

@singleton()
class AAA { a = 'aaa'; }

@injectable('AAA')
class BBB extends AAA { b = 'bbb'; }

const b = new BBB();

class Host {
  @inject()
  repo!: AAA; // resolves to the instance registered under category 'AAA'
}

const h = new Host();
console.log(h.repo === b); // true
```

### 4) Inject by explicit category (string)

Description: When a different string category was used at registration, pass that string to @inject.

```typescript
import 'reflect-metadata';
import { inject, singleton } from 'injectable-decorators';

class DDD { a = 'aaa'; }

@singleton('EEE')
class CCC extends DDD { b = 'bbb'; }

const instance = new CCC();

class Holder {
  @inject('EEE')
  repo!: CCC;
}

const h = new Holder();
console.log(h.repo === instance); // true
```

### 5) Map one constructor to another and inject by constructor

Description: You can register an injectable using another constructor as the category, then inject it by that constructor.

```typescript
import 'reflect-metadata';
import { injectable, inject } from 'injectable-decorators';

class Token {}

@injectable(Token, { callback: (original) => original })
class Impl {
  id = 1;
}

class UsesImpl {
  @inject(Token)
  object!: Impl; // injects the instance registered under Token (Impl instance)
}

const u = new UsesImpl();
console.log(u.object instanceof Impl); // true
```

### 6) Non-singleton injectables with @onDemand and passing constructor args

Description: Use @onDemand() so each injection produces a fresh instance. You can pass args for construction via @inject({ args }).

```typescript
import 'reflect-metadata';
import { onDemand, inject } from 'injectable-decorators';

@onDemand()
class FreshObject {
  constructor(public a?: string, public b?: string) {}
}

class ParentA {
  @inject()
  fresh!: FreshObject; // new instance per parent
}

class ParentB {
  @inject({ args: ['x', 'y'] })
  fresh!: FreshObject; // passes constructor args to on-demand instance
}

const p1 = new ParentA();
const p2 = new ParentA();
console.log(p1.fresh !== p2.fresh); // true

const p3 = new ParentB();
console.log([p3.fresh.a, p3.fresh.b]); // ['x','y']
```

### 7) Transform an injected value

Description: Modify the resolved instance before assignment using a transformer.

```typescript
import 'reflect-metadata';
import { injectable, inject } from 'injectable-decorators';

@injectable('SomeOtherObject')
class SomeOtherObject { value() { return 10; } }

class Controller {
  @inject({ transformer: (obj: SomeOtherObject, c: Controller) => '1' })
  repo!: SomeOtherObject | string;
}

const c = new Controller();
console.log(c.repo); // '1'
```

### 8) Registry operations: reset and swapping registry

Description: Reset clears all registrations. Swapping the registry replaces the storage, losing previous entries.

```typescript
import { Injectables, InjectableRegistryImp } from 'injectable-decorators';

// ensure something is registered
Injectables.get('SomeOtherObject');

// swap to a fresh registry
Injectables.setRegistry(new InjectableRegistryImp());
console.log(Injectables.get('SomeOtherObject')); // undefined

// reset to a new empty default registry
Injectables.reset();
```

### 9) Singleton vs onDemand convenience decorators

Description: Prefer @singleton() to force single instance, or @onDemand() for new instance per retrieval.

```typescript
import { singleton, onDemand } from 'injectable-decorators';

@singleton()
class OneOnly {}

@onDemand()
class Many {}
```

### 10) Utility helpers and constants

Description: Generate reflection keys and understand default config.

```typescript
import { getInjectKey } from 'injectable-decorators';

console.log(getInjectKey('injectable')); // "inject.db.injectable"
console.log(getInjectKey('inject'));     // "inject.db.inject"
```

Notes:
- Always include `import 'reflect-metadata'` once in your app before using decorators.
- VERSION is exported as a string placeholder defined at build time.


## Coding Principles

- group similar functionality in folders (analog to namespaces but without any namespace declaration)
- one class per file;
- one interface per file (unless interface is just used as a type);
- group types as other interfaces in a types.ts file per folder;
- group constants or enums in a constants.ts file per folder;
- group decorators in a decorators.ts file per folder;
- always import from the specific file, never from a folder or index file (exceptions for dependencies on other packages);
- prefer the usage of established design patters where applicable:
  - Singleton (can be an anti-pattern. use with care);
  - factory;
  - observer;
  - strategy;
  - builder;
  - etc;


### Related

[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=decaf-ts&repo=ts-workspace)](https://github.com/decaf-ts/ts-workspace)

### Social

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/decaf-ts/)




#### Languages

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ShellScript](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)

## Getting help

If you have bug reports, questions or suggestions please [create a new issue](https://github.com/decaf-ts/ts-workspace/issues/new/choose).

## Contributing

I am grateful for any contributions made to this project. Please read [this](./workdocs/98-Contributing.md) to get started.

## Supporting

The first and easiest way you can support it is by [Contributing](./workdocs/98-Contributing.md). Even just finding a typo in the documentation is important.

Financial support is always welcome and helps keep both me and the project alive and healthy.

So if you can, if this project in any way. either by learning something or simply by helping you save precious time, please consider donating.

## License

This project is released under the [MIT License](./LICENSE.md).

By developers, for developers...
