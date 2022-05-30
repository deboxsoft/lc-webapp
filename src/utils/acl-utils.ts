import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import type { ACLContext } from "../types";
import { getContext, setContext } from "svelte";

export type AclContextOptions = {
  resource: string;
  authContext: AuthenticationContext;
  key?: string;
};
export const createAclContext = ({ key = "acl-context", authContext, resource }: AclContextOptions): ACLContext => {
  const query = authContext.getQuery(resource);
  const readGranted = query.read().granted;
  const createGranted = query.create().granted;
  const updateGranted = query.update().granted;
  const removeGranted = query.delete().granted;
  const context = {
    auth: authContext,
    query,
    readGranted,
    createGranted,
    updateGranted,
    removeGranted
  };
  setContext(key, context);
  return context;
};

export const getAclContext = (key: string = "acl-context") => {
  return getContext<ACLContext>(key);
};
