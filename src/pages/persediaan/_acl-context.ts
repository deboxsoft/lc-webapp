import { setContext, getContext } from "svelte";
import { getAuthenticationContext } from "__@modules/users";
import type { ACLContext } from "__@root/types";

export const createAclContext = () => {
  const auth = getAuthenticationContext();
  const query = auth.getQuery("stock");
  const createGranted = query.create().granted;
  const approveGranted = query.approve().granted;
  const readGranted = query.read().granted;
  const updateGranted = query.update().granted;
  const removeGranted = query.delete().granted;
  const context = {
    auth,
    createGranted,
    readGranted,
    updateGranted,
    removeGranted,
    approveGranted
  };
  setContext("acl-context", context);
  return context;
};

export const getAclContext = () => {
  return getContext<ACLContext>("acl-context");
};
