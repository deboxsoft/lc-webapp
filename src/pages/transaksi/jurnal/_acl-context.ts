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

const resource = "transaction";

export const createAclContext = () => {
  const auth = getAuthenticationContext();
  const query = auth.getQuery(resource);
  const createGranted = query.create().granted;
  const readGranted = query.read().granted;
  const approveGranted = query.approve().granted;
  const rejectGranted = query.reject().granted;
  const updateGranted = (userId) => auth.isOwner(userId) || query.update().granted;
  const removeGranted = (userId) => auth.isOwner(userId) || query.delete().granted;
  const createPaymentGranted = auth.getPermission({
    resource,
    action: "create-payment",
    possession: "any"
  }).granted;
  const createCashierGranted = auth.getPermission({
    resource,
    action: "create-cashier",
    possession: "any"
  }).granted;
  const context = {
    auth,
    createGranted,
    createPaymentGranted,
    createCashierGranted,
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
