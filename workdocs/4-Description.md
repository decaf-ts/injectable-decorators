### Description

Standalone module, exposes a simple implementation for Dependency injection:
- Injectables are singletons;
- they are injected by overriding a class's attribute `getter` and are only requested when actually needed, simplifying the injection order;
- Developer is responsible for originally instantiating them;