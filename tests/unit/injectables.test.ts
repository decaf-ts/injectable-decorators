import { inject, injectable, onDemand, singleton } from "../../src";
import { Injectables } from "../../src/Injectables";
import { InjectableRegistryImp } from "../../src";

const mock = jest.fn();

@injectable()
class InitialObject {
  constructor() {
    mock("InitialObject");
  }

  doSomething() {
    return 5;
  }
}

@injectable("SomeObject")
class SomeObject {
  constructor() {
    mock("SomeObject");
  }

  doSomething() {
    return 5;
  }
}

@injectable("SomeOtherObject")
class SomeOtherObject {
  constructor() {
    mock("SomeOtherObject");
  }
  doSomething() {
    return 10;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class OtherObject {
  @inject("SomeObject")
  object!: SomeObject;

  constructor() {}
}

describe(`Injectables`, function () {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it(`Instantiates Properly Initial Object`, function () {
    const obj: InitialObject = new InitialObject();
    expect(obj).not.toBeNull();
    expect(obj.constructor.name).toEqual(InitialObject.name);
    expect(mock).toHaveBeenCalled();
    expect(mock).toHaveBeenCalledWith("InitialObject");
  });

  it(`Instantiates Properly`, function () {
    const obj: SomeObject = new SomeObject();
    expect(obj).not.toBeNull();
    expect(obj.constructor.name).toEqual(SomeObject.name);
    expect(mock).toHaveBeenCalled();
    expect(mock).toHaveBeenCalledWith("SomeObject");
  });

  it(`Registers itself onto the registry upon Instantiation`, function () {
    const obj: SomeObject = new SomeObject();
    const repo: SomeObject = Injectables.get(SomeObject);
    expect(obj).toEqual(repo);
  });

  it(`Handles more than one Injectable`, function () {
    const testRepository1: SomeObject = new SomeObject();
    const testRepository2: SomeOtherObject = new SomeOtherObject();
    let repo: SomeObject = Injectables.get(SomeObject);
    expect(testRepository1).toEqual(repo);

    repo = Injectables.get(SomeOtherObject);
    expect(testRepository2).toEqual(repo);
  });

  it(`Gets Injected Properly`, function () {
    class Controller {
      @inject()
      repo!: InitialObject;

      constructor() {}
    }

    const testController: Controller = new Controller();

    expect(testController.repo).toBeDefined();

    const repo = Injectables.get(InitialObject);
    expect(testController.repo).toEqual(repo);
  });

  it(`Gets transformer Properly`, function () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transform = function (el: any) {
      return "1";
    };

    class Controller {
      @inject({ transformer: transform })
      repo!: SomeOtherObject;

      constructor() {}
    }

    const testController: Controller = new Controller();

    expect(testController.repo).toBeDefined();

    const repo = Injectables.get(SomeOtherObject);
    expect(testController.repo).not.toEqual(repo);
    expect(testController.repo).toEqual("1");
  });

  it(`Responds to category as an injectable`, function () {
    @singleton()
    class AAA {
      protected a: string = "aaa";
    }

    @injectable("AAA")
    class BBB extends AAA {
      protected b: string = "bbb";
    }

    const b = new BBB();

    class Controller {
      @inject()
      repo!: AAA;

      constructor() {}
    }

    const testController: Controller = new Controller();

    expect(testController.repo).toBeDefined();

    expect(testController.repo).toBe(b);
  });

  it(`Responds to category while injected`, function () {
    class DDD {
      protected a: string = "aaa";
    }

    @singleton("EEE")
    class CCC extends DDD {
      protected b: string = "bbbdsad";
    }

    const b = new CCC();

    class Controller {
      @inject("EEE")
      repo!: CCC;

      constructor() {}
    }

    const testController: Controller = new Controller();

    expect(testController.repo).toBeDefined();

    expect(testController.repo).toBe(b);
  });

  it("Injects according to a defined object", () => {
    class EEE {
      constructor() {}
    }
    @injectable(EEE, {
      callback: (original) => {
        return original;
      },
    })
    class FFF {
      constructor() {}
    }

    class GGG {
      @inject(EEE)
      object!: any;
    }

    const g = new GGG();
    expect(g.object).toBeDefined();
    expect(g.object).toBeInstanceOf(FFF);
  });

  it("injects fresh instances when configured", () => {
    const fn = jest.fn();

    @onDemand()
    class FreshObject {
      constructor(...args: any[]) {
        fn(...args);
      }
    }

    class FreshParent {
      @inject()
      freshObject!: FreshObject;

      constructor() {}
    }

    const instance1 = new FreshParent();

    expect(instance1.freshObject).toBeDefined();
    expect(instance1.freshObject).toBeInstanceOf(FreshObject);

    const instance2 = new FreshParent();
    expect(instance2.freshObject).toBeDefined();
    expect(instance2.freshObject).toBeInstanceOf(FreshObject);

    expect(fn).toHaveBeenCalledTimes(2);

    expect(instance1.freshObject).not.toBe(instance2.freshObject);

    jest.resetAllMocks();

    class FreshParent2 {
      @inject(FreshObject, { args: ["a", "b"] })
      freshObject!: FreshObject;
      constructor() {}
    }

    const instance3 = new FreshParent2();
    expect(instance3.freshObject).toBeDefined();
    expect(instance3.freshObject).toBeInstanceOf(FreshObject);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a", "b");
  });

  it("Changes Registry", () => {
    expect(Injectables.get("SomeOtherObject")).toBeDefined();
    Injectables.setRegistry(new InjectableRegistryImp());
    expect(Injectables.get("SomeOtherObject")).not.toBeDefined();
  });
});
