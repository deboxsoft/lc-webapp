import { stores } from "@deboxsoft/users-client";
import { writable } from "svelte/store";

let profile = writable({ username: "Nurdiansyah", id: "13" });
export const getAuthStore = () => ({ profile });
export const createAuthStore = (_profile) => {
  return stores.createAuthenticationManagerStore();
};
