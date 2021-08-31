import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import { setContext, getContext } from "svelte";
import { getAuthenticationContext } from "__@modules/users";

type Context = {
  auth: AuthenticationContext;
  createGranted: boolean;
  readGranted: boolean;
  updateGranted: (userId: string) => boolean;
  removeGranted: (userId: string) => boolean;
};

const resource = "cashier";

export const createAclContext = () => {
  const auth = getAuthenticationContext();
  const query = auth.getQuery(resource);
  const createGranted = query.create().granted;
  const readGranted = query.read().granted;
  const updateGranted = (userId) => auth.isOwner(userId) || query.update().granted;
  const removeGranted = (userId) => auth.isOwner(userId) || query.delete().granted;
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
