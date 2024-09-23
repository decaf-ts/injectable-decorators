## Considerations

#### Typescript Compilation options

Even though all code is exported in both CommonJS and ESM format, and the default is ES2022
in order to take advantage to all the latest Typescript and JS features,
when importing  these libraries the following flag in `tsconfig.compilerOptions` is mandatory:
```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  "useDefineForClassFields": false
}
```