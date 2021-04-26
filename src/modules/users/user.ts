import type { UserContext } from "@deboxsoft/users-client/types/stores";

import { stores, graphql } from "@deboxsoft/users-client";
import { ApplicationContext, getApplicationContext } from "../app";

const KEY = Symbol("user");

export const createUserContext = () => {
  const store = writable<Partial<User>>({
    id: "1232345",
    username: "demo",
    role: ["ADMIN"]
  });
};

export const getUserContext = (): { user: Readable<Partial<User>> } => getContext(KEY);
