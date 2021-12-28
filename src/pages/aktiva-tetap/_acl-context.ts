import { setContext, getContext } from "svelte";
import { getAuthenticationContext } from "__@modules/users";
import type { ACLContext } from "__@root/types";

export const createAclContext = () => {
  const auth = getAuthenticationContext();
  const query = auth.getQuery("inventory");
  const createGranted = query.create().granted;
  const readGranted = query.read().granted;
  const updateGranted = query.update().granted;
  const removeGranted = query.delete().granted;
  const approveGranted = query.approve().granted;
  const context = {
    auth,
    approveGranted,
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
