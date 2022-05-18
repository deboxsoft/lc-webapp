import resolve from "@rollup/plugin-node-resolve";
import Hmr from "rollup-plugin-hot";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import { copySync, removeSync } from "fs-extra";
import { spassr } from "spassr";
import svelte from "rollup-plugin-svelte-hot";
// import sucrase from "@rollup/plugin-sucrase";
import typescript from "@rollup/plugin-typescript";
import getConfig from "@roxi/routify/lib/utils/config";
import { injectManifest } from "rollup-plugin-workbox";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// const comBaseResolve = require.resolve("@deboxsoft/svelte-components-base");
const createPreprocess = require("../../svelte.config").createPreprocess;

const { distDir } = getConfig(); // use Routify's distDir for SSOT
const assetsDir = "assets";
const production = process.env.NODE_ENV === "production";
const buildDir = "dist/build";
const isNollup = !!process.env.NOLLUP;
const mode = process.env.ROLLUP_WATCH && "development";
const dev = mode === "development";
const preprocess = createPreprocess({
  scss: {
    // includePaths: ["./src", path.dirname(comBaseResolve)]
  }
});

const tsPlugin = () => {
  return typescript({});
};

// clear previous builds
removeSync(distDir);
removeSync(buildDir);

const serve = () => ({
  writeBundle: async () => {
    const options = {
      assetsDir: [assetsDir, distDir],
      entrypoint: `${assetsDir}/index.html`,
      script: `${buildDir}/main.js`
    };
    spassr({ ...options, port: 5000 });
    spassr({
      ...options,
      ssr: true,
      port: 5005,
      ssrOptions: { inlineDynamicImports: true, dev: true }
    });
  }
});

const copyToDist = () => ({
  writeBundle() {
    copySync(assetsDir, distDir);
  }
});
export default [
  {
    preserveEntrySignatures: false,
    input: ["src/main.ts"],
    output: {
      sourcemap: false,
      format: "esm",
      dir: buildDir,
      // for performance, disabling filename hashing in development
      chunkFileNames: `[name].js`
    },
    plugins: [
      replace({
        preventAssignment: true,
        "__@comps": path.join(__dirname, "src", "components"),
        "__@modules": path.join(__dirname, "src", "modules"),
        "__@stores": path.join(__dirname, "src", "stores"),
        "__@root": path.join(__dirname, "src"),
        "process.env.DBX_ENV_GRAPHQL_URL": `"${process.env.DBX_ENV_GRAPHQL_URL}"`,
        "process.env.DBX_ENV_GRAPHQL_WS": `"${process.env.DBX_ENV_GRAPHQL_WS}"`,
        "process.env.DBX_ENV_API_URL": `"${process.env.DBX_ENV_API_URL}"`,
        "process.env.NODE_ENV": `"${production}"`
      }),
      svelte({
        hot: isNollup,
        extensions: [".svelte", ".md", ".svx"],
        dev,
        css: (css) => css.write("bundle.css"),
        preprocess
      }),
      resolve({
        browser: true,
        dedupe: (importee) => !!importee.match(/svelte(\/|$)/)
      }),
      commonjs(),
      tsPlugin(),
      !dev &&
        production &&
        terser({
          module: true
        }),
      dev && !isNollup && serve(),
      dev && !isNollup && livereload(distDir),
      dev &&
        isNollup &&
        Hmr({
          isMemory: true,
          public: assetsDir
        }),
      {
        transform: (code) => ({
          code: code.replace("process.env.NODE_ENV", process.env.NODE_ENV),
          map: { mappings: "" }
        })
      },
      injectManifest({
        globDirectory: assetsDir,
        globPatterns: ["**/*.{js,css,svg}", "index.html"],
        swSrc: `src/sw.js`,
        swDest: `dist/serviceworker.js`,
        maximumFileSizeToCacheInBytes: 10000000, // 10 MB,
        mode: "production"
      }),
      !dev && copyToDist()
    ],
    onwarn(warning, rollupWarn) {
      if (warning.code !== "CIRCULAR_DEPENDENCY") {
        rollupWarn(warning);
      }
    },
    watch: {
      clearScreen: false,
      buildDelay: 100
    }
  }
];
