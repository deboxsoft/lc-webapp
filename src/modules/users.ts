import { getApplicationContext, ApplicationContext } from "./app";
import { stores } from "@deboxsoft/users-client";

export const createUsersModuleContext = (applicationContext: ApplicationContext = getApplicationContext()) => {
  return stores.createAuthenticationContext(applicationContext);
};
export const createUserContext = stores.createUserContext;
export const createAccessControlContext = stores.createAccessControlContext;
export const getAuthenticationContext = stores.getAuthenticationContext;
export const getUserContext = stores.getUserContext;
export const getAccessControlContext = stores.getAccessControlContext;
