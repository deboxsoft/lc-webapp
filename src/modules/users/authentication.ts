import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";

import { stores, graphql } from "@deboxsoft/users-client";
import { ApplicationContext, getApplicationContext } from "../app";
import { createJwtStore } from "__@stores/session";

let authenticationService;

export const createAuthenticationContext = (
  { fetch, notify, env }: ApplicationContext = getApplicationContext()
): AuthenticationContext => {
  authenticationService = new graphql.AuthenticationGraphqlClient(fetch);
  const jwtStore = createJwtStore();
  return stores.createAuthenticationStoreService({
    jwtStore,
    authenticationService,
    notify: (env !== "production" && notify) || undefined,
    errors: {},
    notifications: {}
  });
};

export const getAuthenticationService = () => authenticationService;

export const getAuthenticationContext = (): AuthenticationContext => stores.getAuthenticationContext();
