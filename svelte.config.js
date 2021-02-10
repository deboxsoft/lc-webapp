const sveltePreprocess = require("svelte-preprocess");
const componentBaseResolve = require.resolve("@deboxsoft/svelte-components-base");
const createPreprocess = (options) => {
  const scss = options.scss || {};
  return sveltePreprocess({
    scss: Object.assign(scss, {
      implementation: require("sass"),
      renderSync: true
    }),
    postcss: {
      plugins: [require("autoprefixer")]
    },
    typescript: {
      compilerOptions: {
        allowJs: true
      }
    }
  });
};
const preprocess = createPreprocess({
  scss: {
    includePaths: [componentBaseResolve]
  }
});
module.exports = {
  preprocess,
  createPreprocess
};
