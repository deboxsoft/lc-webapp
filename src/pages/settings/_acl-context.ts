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
  const permission = auth.getPermission("setting");
  const userPermission = auth.getPermission("user");
  const readGranted = permission.read().granted;
  const updateGranted = permission.update().granted;
  const readUserGranted = userPermission.read().granted;
  const createUserGranted = userPermission.create().granted;
  const updateUserGranted = userPermission.update().granted;
  const removeUserGranted = userPermission.delete().granted;
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
