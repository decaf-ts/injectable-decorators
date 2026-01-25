![Banner](./workdocs/assets/decaf-logo.svg)
## Simple Injectables engine

A lightweight TypeScript dependency injection library that provides decorators for marking classes as injectable singletons and injecting dependencies into class properties. It features a centralized registry for managing dependencies, lazy loading of injected properties, and support for custom transformations of injected instances.

> Release docs refreshed on 2025-11-26. See [workdocs/reports/RELEASE_NOTES.md](./workdocs/reports/RELEASE_NOTES.md) for ticket summaries.

### Core Concepts

*   **`@injectable()`**: A class decorator that registers a class with the dependency injection system, making it available for injection.
*   **`@inject()`**: A property decorator that injects a registered dependency into a class property.
*   **`Injectables` Class**: A static class that acts as the central registry for managing injectable dependencies.
*   **Singleton vs. On-Demand**: Injectables can be configured to be singletons (one instance shared across the application) or on-demand (a new instance created each time it's injected).

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

Minimal size: 1.5 KB kb gzipped


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


# How to Use

This guide provides examples of how to use the main features of the `@decaf-ts/injectable-decorators` library.

## Creating an Injectable Service

The `@injectable()` decorator marks a class as available for dependency injection.

```typescript
import { injectable } from '@decaf-ts/injectable-decorators';

@injectable()
class MyService {
  greet() {
    return 'Hello from MyService!';
  }
}
```

## Injecting a Service

The `@inject()` decorator injects a registered dependency into a class property.

```typescript
import { inject } from '@decaf-ts/injectable-decorators';
import { MyService } from './MyService';

class MyComponent {
  @inject()
  private myService!: MyService;

  doSomething() {
    console.log(this.myService.greet());
  }
}

const component = new MyComponent();
component.doSomething(); // Outputs: "Hello from MyService!"
```

## Singleton vs. On-Demand

By default, injectables are singletons. You can change this behavior using the `@onDemand` decorator or by passing a configuration object to `@injectable`.

### Singleton (Default)

```typescript
import { injectable } from '@decaf-ts/injectable-decorators';

@injectable() // or @singleton()
class MySingletonService {
  constructor() {
    console.log('MySingletonService instance created');
  }
}

// ...

const component1 = new MyComponent(); // MySingletonService instance created
const component2 = new MyComponent(); // No new instance created
```

### On-Demand

```typescript
import { onDemand } from '@decaf-ts/injectable-decorators';

@onDemand()
class MyOnDemandService {
  constructor() {
    console.log('MyOnDemandService instance created');
  }
}

// ...

const component1 = new MyComponent(); // MyOnDemandService instance created
const component2 = new MyComponent(); // MyOnDemandService instance created
```

## Injecting with a Category

You can register and inject dependencies using a string or symbol as a category, which is useful for avoiding issues with minification or for upcasting.

```typescript
import { injectable, inject } from '@decaf-ts/injectable-decorators';

const IMyService = 'IMyService';

@injectable(IMyService)
class MyServiceImpl {
  // ...
}

class MyOtherComponent {
  @inject(IMyService)
  private myService!: MyServiceImpl;
}
```


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
