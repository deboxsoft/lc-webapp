import type { Query } from "@deboxsoft/users-api";
import type { AuthenticationContext } from "@deboxsoft/users-client/types/stores";

export type ACLContext = {
  auth: AuthenticationContext;
  query: Query;
  createGranted: boolean;
  readGranted: boolean;
  updateGranted: boolean;
  removeGranted: boolean;
  approveGranted: boolean;
};
