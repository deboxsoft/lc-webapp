import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";
import type { FetchGraphql } from "@deboxsoft/module-graphql";
import type { ApisContext } from "@deboxsoft/module-client";

import { stores, graphql } from "@deboxsoft/users-client";
import { createJwtStore } from "__@stores/session";

let authenticationService;

let authService;

export const getAuthService = (fetch: FetchGraphql) => {
  if (!authService) {
    authService = new graphql.AuthenticationGraphqlClient(fetch);
  }
  return authService;
};

export const createAuthenticationContext = (apisContext: ApisContext): AuthenticationContext => {
  authService = getAuthService(apisContext.fetchGraphql);
  const jwtStore = createJwtStore();
  return stores.createAuthenticationStoreService({
    jwtStore,
    authenticationService: authService,
    errors: {},
    notifications: {}
  });
};

export const getAuthenticationService = () => authenticationService;

export const getAuthenticationContext = (): AuthenticationContext => stores.getAuthenticationContext();
