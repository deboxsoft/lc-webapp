import { setContext, getContext } from "svelte";
import { getAuthenticationContext } from "__@modules/users";
import type { ACLContext } from "__@root/types";

export const createAclContext = () => {
  const auth = getAuthenticationContext();
  const permission = auth.getPermission("inventory");
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
  return getContext<ACLContext>("acl-context");
};
