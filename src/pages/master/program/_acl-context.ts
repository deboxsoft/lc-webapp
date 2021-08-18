import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import { setContext, getContext } from "svelte";
import { getAuthenticationContext } from "__@modules/users";

type Context = {
  auth: AuthenticationContext;
  createGranted: boolean;
  readGranted: boolean;
  updateGranted: boolean;
  removeGranted: boolean;
};

export const createAclContext = () => {
  const auth = getAuthenticationContext();
  const query = auth.getQuery("program");
  const createGranted = query.create().granted;
  const readGranted = query.read().granted;
  const updateGranted = query.update().granted;
  const removeGranted = query.delete().granted;
  const context = {
    auth,
    createGranted,
    readGranted,
    updateGranted,
    removeGranted
  };
  setContext("acl-context", context);
  return context;
};

export const getAclContext = () => {
  return getContext<Context>("acl-context");
};
