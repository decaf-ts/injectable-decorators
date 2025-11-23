import {
  model,
  Model,
  ModelArg,
  required,
} from "@decaf-ts/decorator-validation";
import { injectable } from "../../src/decorators";
import { inject } from "../../src/decorators";

describe("injectable compatibility test", () => {
  @injectable()
  class ToInject {
    constructor() {}
  }

  class TestModel extends Model {
    @required()
    name!: string;
    @required()
    age!: number;

    @inject()
    service!: ToInject;

    constructor(arg?: ModelArg<TestModel>) {
      super(arg);
      Model.fromObject(this, arg);
    }
  }

  class TestModel2 extends Model {
    @required()
    name!: string;
    @required()
    age!: number;

    @inject()
    service!: ToInject;

    constructor(arg?: ModelArg<TestModel2>) {
      super(arg);
      Model.fromModel(this, arg);
    }
  }

  @model()
  class TestModel3 extends Model {
    @required()
    name!: string;
    @required()
    age!: number;

    @inject()
    service!: ToInject;

    constructor(arg?: ModelArg<TestModel3>) {
      super(arg);
    }
  }

  beforeAll(() => {
    new ToInject();
  });

  it("injects on model with Model.fromObject", () => {
    const m = new TestModel({
      name: "test_name",
      age: 18,
    });
    expect(m).toBeDefined();
    expect(m.name).toBeDefined();
    expect(m.age).toBeDefined();
    expect(m.name).toEqual("test_name");
    expect(m.age).toEqual(18);
    expect(m.service).toBeDefined();
    expect(m.service).toBeInstanceOf(ToInject);
  });

  it("injects on model with Model.fromModel", () => {
    const m = new TestModel2({
      name: "test_name",
      age: 18,
    });
    expect(m).toBeDefined();
    expect(m.name).toBeDefined();
    expect(m.age).toBeDefined();
    expect(m.name).toEqual("test_name");
    expect(m.age).toEqual(18);
    expect(m.service).toBeDefined();
    expect(m.service).toBeInstanceOf(ToInject);
  });

  it("injects on model with @model()", () => {
    const m = new TestModel3({
      name: "test_name",
      age: 18,
    });
    expect(m).toBeDefined();
    expect(m.name).toBeDefined();
    expect(m.age).toBeDefined();
    expect(m.name).toEqual("test_name");
    expect(m.age).toEqual(18);
    expect(m.service).toBeDefined();
    expect(m.service).toBeInstanceOf(ToInject);
  });
});
