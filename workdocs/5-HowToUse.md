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
