import {inject, injectable} from "../../src";
import {Injectables} from "../../src/Injectables";
import {InjectableRegistryImp} from "../../src";

@injectable("SomeObject")
class SomeObject{
    doSomething(){
        return 5;
    }
}

@injectable("SomeOtherObject", true)
class SomeOtherObject{
    doSomething(){
        return 10;
    }
}

class OtherObject {
    @inject("SomeObject")
    object!: SomeObject;

    constructor() {
    }
}


describe(`Injectables`, function(){

    it(`Instantiates Properly`, function(){
        const obj: SomeObject = new SomeObject();
        expect(obj).not.toBeNull();
        expect(obj.constructor.name).toEqual(SomeObject.name);
    });

    it(`Registers itself onto the registry upon Instantiation`, function(){
        const obj: SomeObject = new SomeObject();
        const repo: SomeObject = Injectables.get(obj.constructor.name) as SomeObject;
        expect(obj).toEqual(repo);
    });

    it(`Handles more than one Injectable`, function(){
        const testRepository1: SomeObject = new SomeObject();
        const testRepository2: SomeOtherObject = new SomeOtherObject();
        let repo: SomeObject = Injectables.get(testRepository1.constructor.name) as SomeObject;
        expect(testRepository1).toEqual(repo);

        repo = Injectables.get(testRepository2.constructor.name) as SomeOtherObject;
        expect(testRepository2).toEqual(repo);
    });

    it(`Responds to force`, function(){
        const testRepository1: SomeOtherObject = new SomeOtherObject();
        const testRepository2: SomeOtherObject = new SomeOtherObject();
        let repo: SomeOtherObject = Injectables.get(testRepository1.constructor.name) as SomeOtherObject;
        expect(testRepository1).toBe(repo);

        repo = Injectables.get(testRepository2.constructor.name) as SomeOtherObject;
        expect(testRepository2).toBe(repo);
    });

    it(`Gets Injected Properly`, function(){
        class Controller{

            @inject()
            repo!: SomeOtherObject;

            constructor(){
            }
        }

        const testController: Controller = new Controller();

        expect(testController.repo).toBeDefined();

        const repo = Injectables.get("SomeOtherObject");
        expect(testController.repo).toEqual(repo);
    });

    it(`Gets transformer Properly`, function(){

        const transform = function(el: any){
            return "1";
        }

        class Controller{

            @inject(undefined, transform)
            repo!: SomeOtherObject;

            constructor(){
            }
        }

        const testController: Controller = new Controller();

        expect(testController.repo).toBeDefined();

        const repo = Injectables.get("SomeOtherObject");
        expect(testController.repo).not.toEqual(repo);
        expect(testController.repo).toEqual("1");
    });

    it(`Responds to category as an injectable`, function(){

        class AAA {
            protected a: string = "aaa"
        }

        @injectable("AAA")
        class BBB extends AAA{
            protected b: string = "bbb"
        }

        const b = new BBB();

        class Controller{

            @inject()
            repo!: AAA;

            constructor(){
            }
        }

        const testController: Controller = new Controller();

        expect(testController.repo).toBeDefined();

        expect(testController.repo).toBe(b);
    });

    it(`Responds to category while injected`, function(){

        class AAA {
            protected a: string = "aaa"
        }

        @injectable("AAA")
        class BBB extends AAA{
            protected b: string = "bbb"
        }

        const b = new BBB();

        class Controller{

            @inject("AAA")
            repo!: BBB;

            constructor(){
            }
        }

        const testController: Controller = new Controller();

        expect(testController.repo).toBeDefined();

        expect(testController.repo).toBe(b);
    });

    it("Changes Registry", () => {
        expect(Injectables.get("SomeOtherObject")).toBeDefined();
        Injectables.setRegistry(new InjectableRegistryImp())
        expect(Injectables.get("SomeOtherObject")).not.toBeDefined();
    })
});