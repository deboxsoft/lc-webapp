import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import { setContext, getContext } from "svelte";
import { getAuthenticationContext } from "__@modules/users";

type Context = {
  auth: AuthenticationContext;
  readGranted: boolean;
  updateGranted: boolean;
  readUserGranted: boolean;
  createUserGranted: boolean;
  updateUserGranted: boolean;
  removeUserGranted: boolean;
};

export const createAclContext = () => {
  const auth = getAuthenticationContext();
  const query = auth.getQuery("setting");
  const userQuery = auth.getQuery("user");
  const readGranted = query.read().granted;
  const updateGranted = query.update().granted;
  const readUserGranted = userQuery.read().granted;
  const createUserGranted = userQuery.create().granted;
  const updateUserGranted = userQuery.update().granted;
  const removeUserGranted = userQuery.delete().granted;
  const context = {
    auth,
    readGranted,
    updateGranted,
    readUserGranted,
    createUserGranted,
    updateUserGranted,
    removeUserGranted
  };
  setContext("acl-context", context);
  return context;
};

export const getAclContext = () => {
  return getContext<Context>("acl-context");
};
