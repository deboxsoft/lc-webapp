import type { Fetch } from "@deboxsoft/module-core";
import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";

import { stores, graphql } from "@deboxsoft/users-client";
import { ApplicationContext, getApplicationContext } from "../app";
import { createJwtStore } from "__@stores/session";

let authenticationService;

let authService;

export const getAuthService = (fetch: Fetch) => {
  if (!authService) {
    authService = new graphql.AuthenticationGraphqlClient(fetch);
  }
  return authService;
};

export const createAuthenticationContext = (
  { fetch, notify, env }: ApplicationContext = getApplicationContext()
): AuthenticationContext => {
  authService = getAuthService(fetch);
  const jwtStore = createJwtStore();
  return stores.createAuthenticationStoreService({
    jwtStore,
    authenticationService: authService,
    notify: (env !== "production" && notify) || undefined,
    errors: {},
    notifications: {}
  });
};

export const getAuthenticationService = () => authenticationService;

export const getAuthenticationContext = (): AuthenticationContext => stores.getAuthenticationContext();
