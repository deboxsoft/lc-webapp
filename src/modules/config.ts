import type { Fetch } from "@deboxsoft/module-core";
import { gql } from "@deboxsoft/module-graphql";

const ConfigQuery = gql`
  query configApp {
    configApp {
      staticUrl
      avatarUploadUrl
      avatarUploadPath
      avatarUrl
      brandUploadUrl
      brandUploadPath
      brandUrl
      version
    }
  }
`;

export const createConfigModule = (fetch: Fetch, options = {}): Promise<any> => {
  return fetch<any>(ConfigQuery, options).then((_) => _.configApp);
};
