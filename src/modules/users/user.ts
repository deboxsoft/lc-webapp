import type { UserContext } from "@deboxsoft/users-client/types/stores";

import { stores, graphql } from "@deboxsoft/users-client";
import { ApplicationContext, getApplicationContext } from "../app";

export const createUserContext = (
  { fetch, notify, env }: ApplicationContext = getApplicationContext()
): UserContext => {
  const userService = new graphql.UserGraphqlClient(fetch);
  return stores.createUserStoreService({
    userService,
    notify: (env !== "production" && notify) || undefined,
    errors: {},
    notifications: {}
  });
};

export const getUserContext = (): UserContext => stores.getUserContext();
