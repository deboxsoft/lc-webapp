// global

import { createFetchGraphql } from "@deboxsoft/module-core";
import HMR from "@roxi/routify/hmr";
import App from "./App.svelte";

createFetchGraphql({
  url: process.env.DBX_ENV_GRAPHQL_URL || "localhost:3000/graphql"
});
const app = HMR(App, { target: document.body }, "debox-app");

export default app;
