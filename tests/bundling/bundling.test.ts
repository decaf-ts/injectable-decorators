import {Injectables} from "../../src";

describe("Distribution Tests", () => {
    it("reads lib", () => {
        const {Injectables} = require("../../lib/index.cjs");
        expect(Injectables).toBeDefined();
    })

    it ("reads JS Bundle", () => {
        const {Injectables} = require("../../dist/injectable-decorators.bundle.min.js");
        expect(Injectables).toBeDefined();
    })
})