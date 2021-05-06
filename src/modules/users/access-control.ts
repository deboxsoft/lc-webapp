import type { AccessControlContext } from "@deboxsoft/users-client/types/stores";

import { stores, graphql } from "@deboxsoft/users-client";
import { ApplicationContext, getApplicationContext } from "../app";

export const createAccessControlContext = (
  { fetch, notify, env }: ApplicationContext = getApplicationContext()
): AccessControlContext => {
  const accessControlService = new graphql.AccessControlGraphqlClient(fetch);
  return stores.createAccessControlStoreService({
    accessControlService,
    notify: (env !== "production" && notify) || undefined,
    errors: {},
    notifications: {}
  });
};

export const getAccessControlContext = (): AccessControlContext => stores.getAccessControlContext();
