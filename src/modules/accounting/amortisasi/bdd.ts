// import { getApplicationContext } from "__@modules/app";
// import { stores, graphql } from "@deboxsoft/accounting-client";
import { getContext, setContext } from "svelte";
// import { derived, Writable } from "svelte/store";

// import { createMock } from "__@stores/store";

const KEY = {};

export const createBddContext = () => {
  // const { fetch, notify } = getApplicationContext();
  // const bddService = new graphql.BddGraphqlClient(fetch);
  // const store = stores.createBddStoreService({ bddService, notify });
  // const store = createMock();
  // setContext(KEY, store);
  // return {
  //   bddStore: store.store,
  //   createBdd: store.create,
  //   updateBdd: store.update,
  //   findBdd: store.find,
  //   findBddById: store.findById
  // };
};

export const getBddContext = () => {
  const { bddStore, removeBdd, updateBdd, createBdd, findBdd, findBddById } = getContext<any>(KEY);
  return {
    bddStore,
    removeBdd,
    updateBdd,
    createBdd,
    findBdd,
    findBddById
  };
};
