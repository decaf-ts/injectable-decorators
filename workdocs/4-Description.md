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
