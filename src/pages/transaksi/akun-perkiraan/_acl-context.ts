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
  const permission = auth.getPermission("account");
  const createGranted = permission.create().granted;
  const readGranted = permission.read().granted;
  const updateGranted = permission.update().granted;
  const removeGranted = permission.delete().granted;
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
