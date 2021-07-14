import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";

export type ACLContext = {
  auth: AuthenticationContext;
  createGranted: boolean;
  readGranted: boolean;
  updateGranted: boolean;
  removeGranted: boolean;
};
