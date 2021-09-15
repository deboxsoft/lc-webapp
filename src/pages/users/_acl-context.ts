import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import { setContext, getContext } from "svelte";
import { getAuthenticationContext } from "__@modules/users";

type Context = {
  auth: AuthenticationContext;
  readGranted: boolean;
  updateGranted: boolean;
  createGranted: boolean;
  removeGranted: boolean;
};

export const createAclContext = () => {
  const auth = getAuthenticationContext();
  const query = auth.getQuery("user");
  const readGranted = query.read().granted;
  const updateGranted = query.update().granted;
  const createGranted = query.create().granted;
  const removeGranted = query.delete().granted;
  const context = {
    auth,
    readGranted,
    updateGranted,
    createGranted,
    removeGranted
  };
  setContext("acl-context", context);
  return context;
};

export const getAclContext = () => {
  return getContext<Context>("acl-context");
};
