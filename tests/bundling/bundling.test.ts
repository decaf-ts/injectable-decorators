import { Dirent } from "fs";

describe("Distribution Tests", () => {
  it("reads lib", () => {
    const { Injectables } = require("../../lib/index.cjs");
    expect(Injectables).toBeDefined();
  });

  it("reads JS Bundle", () => {
    let distFile: Dirent[];
    try {
      distFile = require("fs")
        .readdirSync(require("path").join(process.cwd(), "dist"), {
          withFileTypes: true,
        })
        .filter((d: Dirent) => d.isFile() && !d.name.endsWith("esm.js"));
    } catch (e: unknown) {
      throw new Error("Error reading JS bundle: " + e);
    }

    if (distFile.length === 0)
      throw new Error("There should only be a js file in directory");
    const { Injectables } = require(`../../dist/${distFile[0].name}`);
    expect(Injectables).toBeDefined();
  });
});
