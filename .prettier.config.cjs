const {Config} = require("prettier")

/** @type {Config} */
module.exports = {
    /**
     * Prints trailing commas whenever possible
     */
    trailingComma: "es5",
    /**
     * prints spaces between brackets in object literals
     */
    bracketSpacing: true,
    printWidth: 150,
    endOfLine: "lf",
    tabWidth: 4,
    /**
     * prints semi colons in front of statements
     */
    semi: true,
    /**
     * Use single quotes instead of double quotes
     */
    singleQuote: false
};
