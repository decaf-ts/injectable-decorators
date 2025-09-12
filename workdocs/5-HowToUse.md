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
