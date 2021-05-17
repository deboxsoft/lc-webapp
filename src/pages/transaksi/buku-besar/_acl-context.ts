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
  const permission = auth.getPermission("ledger");
  const readGranted = permission.read().granted;
  const context = {
    auth,
    readGranted
  };
  setContext("acl-context", context);
  return context;
};

export const getAclContext = () => {
  return getContext<Context>("acl-context");
};
