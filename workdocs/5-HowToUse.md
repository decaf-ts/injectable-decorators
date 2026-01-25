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
