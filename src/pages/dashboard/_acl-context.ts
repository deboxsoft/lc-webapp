import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import { setContext, getContext } from "svelte";
import { getAuthenticationContext } from "__@modules/users";

type Context = {
  auth: AuthenticationContext;
  readGranted: boolean;
};

export const createAclContext = (resource: string) => {
  const auth = getAuthenticationContext();
  const query = auth.getQuery(resource);
  const readGranted = query.read().granted;
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
