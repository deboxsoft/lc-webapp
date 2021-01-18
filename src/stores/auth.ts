import { setContext, getContext } from "svelte";
// import { writable } from "svelte/store";

interface Options {}

// interface Store {}

interface Context {
  login: Function;
  logout: Function;
}

const AUTH_CONTEXT = "AuthContext";

export const createAuthContext = (options: Options = {}) => {
  // const store = writable<Store>({});

  const context = {
    login: () => {
      return Promise.resolve();
    },
    logout: () => {
      return Promise.resolve();
    },
    authorize: () => {
      return Promise.resolve();
    }
  };

  setContext<Context>(AUTH_CONTEXT, context);
  return context;
};

export const getAuthContext = () => getContext<Context>(AUTH_CONTEXT);
