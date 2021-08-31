module.exports = {
  extends: ["@nurdiansyah/devel"],
  parserOptions: {
    ecmaVersion: 2019
  },
  ignorePatterns: ["coverage", "libs", "node_modules", "build", "dist", "**/*.svelte", "script"],
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true
  }
};
