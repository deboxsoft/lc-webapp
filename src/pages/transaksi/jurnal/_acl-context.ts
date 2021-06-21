import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import { setContext, getContext } from "svelte";
import { getAuthenticationContext } from "__@modules/users";

type Context = {
  auth: AuthenticationContext;
  createGranted: boolean;
  readGranted: boolean;
  approveGranted: boolean;
  rejectGranted: boolean;
  updateGranted: (userId: string) => boolean;
  removeGranted: (userId: string) => boolean;
};

export const createAclContext = () => {
  const auth = getAuthenticationContext();
  const permission = auth.getPermission("transaction");
  const createGranted = permission.create().granted;
  const readGranted = permission.read().granted;
  const approveGranted = permission.approve().granted;
  const rejectGranted = permission.reject().granted;
  const updateGranted = (userId) => auth.isOwner(userId) || permission.update().granted;
  const removeGranted = (userId) => auth.isOwner(userId) || permission.delete().granted;
  const context = {
    auth,
    createGranted,
    readGranted,
    approveGranted,
    rejectGranted,
    updateGranted,
    removeGranted
  };
  setContext("acl-context", context);
  return context;
};

export const getAclContext = () => {
  return getContext<Context>("acl-context");
};
