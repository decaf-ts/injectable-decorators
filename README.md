![Banner](./workdocs/assets/Banner.png)
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

![Line Coverage](workdocs/reports/coverage/badge-lines.svg)
![Function Coverage](workdocs/reports/coverage/badge-functions.svg)
![Statement Coverage](workdocs/reports/coverage/badge-statements.svg)
![Branch Coverage](workdocs/reports/coverage/badge-branches.svg)


![Forks](https://img.shields.io/github/forks/decaf-ts/injectable-decorators.svg)
![Stars](https://img.shields.io/github/stars/decaf-ts/injectable-decorators.svg)
![Watchers](https://img.shields.io/github/watchers/decaf-ts/injectable-decorators.svg)

![Node Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbadges%2Fshields%2Fmaster%2Fpackage.json&label=Node&query=$.engines.node&colorB=blue)
![NPM Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbadges%2Fshields%2Fmaster%2Fpackage.json&label=NPM&query=$.engines.npm&colorB=purple)

Documentation available [here](https://decaf-ts.github.io/injectable-decorators/)

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

- [Initial Setup](./tutorials/For%20Developers.md#_initial-setup_)
- [Installation](./tutorials/For%20Developers.md#installation)

## Basic Usage Examples

### Creating an Injectable Service

**Use Case**: You want to create a service that can be injected into other components of your application.

```typescript
import { injectable } from 'injectable-decorators';

@injectable()
class LoggerService {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR]: ${message}`);
  }
}

// The service is automatically registered in the Injectables registry
// and will be available for injection
```

### Injecting a Service into a Component

**Use Case**: You want to use a service in a component without manually creating an instance.

```typescript
import { inject } from 'injectable-decorators';
import { LoggerService } from './logger.service';

class UserComponent {
  @inject()
  private logger!: LoggerService;

  createUser(username: string): void {
    this.logger.log(`Creating user: ${username}`);
    // User creation logic...
    this.logger.log(`User ${username} created successfully`);
  }
}

// When the logger property is accessed, the LoggerService instance
// will be automatically injected
```

### Using a Custom Category Name

**Use Case**: You want to ensure your injectables work correctly even after code minification, or you want to use a different name for the injectable.

```typescript
import { injectable } from 'injectable-decorators';

@injectable('AuthService')
class AuthenticationService {
  authenticate(username: string, password: string): boolean {
    // Authentication logic...
    return true;
  }
}

class LoginComponent {
  @inject('AuthService')
  private auth!: AuthenticationService;

  login(username: string, password: string): void {
    if (this.auth.authenticate(username, password)) {
      console.log('Login successful');
    } else {
      console.log('Login failed');
    }
  }
}
```

### Using a Transformer with Inject

**Use Case**: You want to transform or configure an injectable instance before it's used.

```typescript
import { inject, InstanceTransformer } from 'injectable-decorators';

@injectable()
class ConfigService {
  private config: Record<string, any> = {
    apiUrl: 'https://api.example.com',
    timeout: 5000
  };

  get(key: string): any {
    return this.config[key];
  }
}

// Transformer function that adds environment-specific configuration
const configTransformer: InstanceTransformer = (config: ConfigService, target: any) => {
  // You could customize the config based on the target or environment
  return config;
};

class ApiClient {
  @inject(undefined, configTransformer)
  private config!: ConfigService;

  fetchData(): Promise<any> {
    const apiUrl = this.config.get('apiUrl');
    const timeout = this.config.get('timeout');

    // Use the configured values...
    return Promise.resolve({ data: 'example' });
  }
}
```

### Manually Registering and Retrieving Injectables

**Use Case**: You want to manually register an existing instance or retrieve an injectable instance directly.

```typescript
import { Injectables } from 'injectable-decorators';

// Register an existing instance
const databaseConnection = {
  query: (sql: string) => Promise.resolve([]),
  close: () => Promise.resolve()
};

Injectables.register(databaseConnection, 'DatabaseConnection');

// Retrieve the instance elsewhere in your code
class QueryService {
  private db = Injectables.get<typeof databaseConnection>('DatabaseConnection');

  async executeQuery(sql: string): Promise<any[]> {
    if (!this.db) {
      throw new Error('Database connection not available');
    }
    return this.db.query(sql);
  }
}
```

### Creating a Custom Injectable Registry

**Use Case**: You want to customize how injectables are stored and retrieved, perhaps for testing or to add additional functionality.

```typescript
import { Injectables, InjectablesRegistry } from 'injectable-decorators';

// Create a custom registry implementation
class LoggingRegistry implements InjectablesRegistry {
  private defaultRegistry: InjectablesRegistry;

  constructor(defaultRegistry: InjectablesRegistry) {
    this.defaultRegistry = defaultRegistry;
  }

  get<T>(name: string, ...args: any[]): T | undefined {
    console.log(`Getting injectable: ${name}`);
    return this.defaultRegistry.get<T>(name, ...args);
  }

  register<T>(constructor: any, ...args: any[]): void {
    console.log(`Registering injectable: ${args[0] || constructor.name}`);
    return this.defaultRegistry.register(constructor, ...args);
  }

  build<T>(obj: Record<string, any>, ...args: any[]): T {
    console.log(`Building injectable: ${obj.name}`);
    return this.defaultRegistry.build<T>(obj, ...args);
  }
}

// Use the custom registry
import { InjectableRegistryImp } from 'injectable-decorators';
const customRegistry = new LoggingRegistry(new InjectableRegistryImp());
Injectables.setRegistry(customRegistry);
```

### Resetting the Registry

**Use Case**: You want to clear all registered injectables, perhaps for testing or when switching application contexts.

```typescript
import { Injectables } from 'injectable-decorators';

// Reset all injectables
Injectables.reset();

// Selectively reset injectables matching a pattern
Injectables.selectiveReset(/^Auth/); // Resets all injectables whose names start with "Auth"
```

### Using Callback with Injectable

**Use Case**: You want to perform additional setup on an injectable instance after it's created.

```typescript
import { injectable } from 'injectable-decorators';

const setupLogger = (instance: LoggerService) => {
  // Configure the logger after instantiation
  instance.setLogLevel('debug');
  instance.enableConsoleOutput(true);
};

@injectable(undefined, false, setupLogger)
class LoggerService {
  private logLevel: string = 'info';
  private consoleOutput: boolean = false;

  setLogLevel(level: string): void {
    this.logLevel = level;
  }

  enableConsoleOutput(enabled: boolean): void {
    this.consoleOutput = enabled;
  }

  log(message: string): void {
    if (this.consoleOutput) {
      console.log(`[${this.logLevel.toUpperCase()}]: ${message}`);
    }
  }
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