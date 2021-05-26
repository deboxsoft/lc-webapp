import type { AccessControlContext } from "@deboxsoft/users-client/types/stores";

import { stores, graphql } from "@deboxsoft/users-client";
import { ApplicationContext, getApplicationContext } from "../app";
import { getAuthService } from "./authentication";

export const createAccessControlContext = (
  { fetchGraphql, notify, env }: ApplicationContext = getApplicationContext()
): AccessControlContext => {
  const accessControlService = new graphql.AccessControlGraphqlClient(fetchGraphql);
  return stores.createAccessControlStoreService({
    authService: getAuthService(fetchGraphql),
    accessControlService,
    notify: (env !== "production" && notify) || undefined,
    errors: {},
    notifications: {}
  });
};

export const getAccessControlContext = (): AccessControlContext => stores.getAccessControlContext();
