import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import { setContext, getContext } from "svelte";
import { getAuthenticationContext } from "__@modules/users";

type Context = {
  auth: AuthenticationContext;
  createGranted: boolean;
  readGranted: boolean;
  approveGranted: boolean;
  rejectGranted: boolean;
  isUpdateOwnGranted: (userId: string) => boolean;
  isRemoveOwnGranted: (userId: string) => boolean;
};

export const createAclContext = () => {
  const auth = getAuthenticationContext();
  const permission = auth.getPermission("transaction");
  const createGranted = permission.create().granted;
  const readGranted = permission.read().granted;
  const approveGranted = permission.approve().granted;
  const rejectGranted = permission.reject().granted;
  const isUpdateOwnGranted = (userId) => auth.isOwner(userId) && permission.updateOwn().granted;
  const isRemoveOwnGranted = (userId) => auth.isOwner(userId) && permission.deleteOwn().granted;
  const context = {
    auth,
    createGranted,
    readGranted,
    approveGranted,
    rejectGranted,
    isUpdateOwnGranted,
    isRemoveOwnGranted
  };
  setContext("acl-context", context);
  return context;
};

export const getAclContext = () => {
  return getContext<Context>("acl-context");
};
