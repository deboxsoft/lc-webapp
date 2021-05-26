import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import type { FetchGraphql } from "@deboxsoft/module-graphql";

import { stores, graphql } from "@deboxsoft/users-client";
import { ApplicationContext, getApplicationContext } from "../app";
import { createJwtStore } from "__@stores/session";

let authenticationService;

let authService;

export const getAuthService = (fetch: FetchGraphql) => {
  if (!authService) {
    authService = new graphql.AuthenticationGraphqlClient(fetch);
  }
  return authService;
};

export const createAuthenticationContext = (
  { fetch, fetchGraphql, notify, env }: ApplicationContext = getApplicationContext()
): AuthenticationContext => {
  authService = getAuthService(fetchGraphql);
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
