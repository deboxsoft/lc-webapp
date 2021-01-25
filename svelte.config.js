const sveltePreprocess = require("svelte-preprocess");

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
    includePaths: ["./node_modules/@deboxsoft/svelte-components-base"]
  }
});
module.exports = {
  preprocess,
  createPreprocess
};
