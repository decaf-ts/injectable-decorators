![Banner](./workdocs/assets/decaf-logo.svg)
## Simple Injectables engine

A lightweight TypeScript dependency injection library that provides decorators for marking classes as injectable singletons and injecting dependencies into class properties. It features a centralized registry for managing dependencies, lazy loading of injected properties, and support for custom transformations of injected instances.

> Release docs refreshed on 2025-11-26. See [workdocs/reports/RELEASE_NOTES.md](./workdocs/reports/RELEASE_NOTES.md) for ticket summaries.

### Core Concepts

*   **`@injectable()`**: A class decorator that registers a class with the dependency injection system, making it available for injection.
*   **`@inject()`**: A property decorator that injects a registered dependency into a class property.
*   **`Injectables` Class**: A static class that acts as the central registry for managing injectable dependencies.
*   **Singleton vs. On-Demand**: Injectables can be configured to be singletons (one instance shared across the application) or on-demand (a new instance created each time it's injected).
