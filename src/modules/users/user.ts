import type { UserService } from "@deboxsoft/users-api";
import type { UserContext } from "@deboxsoft/users-client/types/stores";

import { stores, graphql } from "@deboxsoft/users-client";
import { ApplicationContext, getApplicationContext } from "../app";

let userService: UserService;
export const getUserService = () => userService;

export const createUserContext = (
  { fetchGraphql, notify, env }: ApplicationContext = getApplicationContext()
): UserContext => {
  if (!userService) {
    userService = new graphql.UserGraphqlClient(fetchGraphql);
  }
  return stores.createUserStoreService({
    userService,
    notify: (env !== "production" && notify) || undefined,
    errors: {},
    notifications: {}
  });
};

export const getUserContext = (): UserContext & { uploadProfile: (image: any) => Promise<boolean> } => ({
  ...stores.getUserContext(),
  uploadProfile: (image) => {
    const { fetchGraphql } = getApplicationContext();
    const UploadProfileMutation = `
      uploadProfile($image: Upload) {
        uploadProfile(image: $image)
      }
    `;
    return fetchGraphql(UploadProfileMutation, { variables: { image } }).then((result) => result.uploadProfile);
  }
});
