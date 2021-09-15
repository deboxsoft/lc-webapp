import { CreateGroupSchema } from "@deboxsoft/users-api";
import type { CreateGroupInput } from "@deboxsoft/users-api";
import { z } from "@deboxsoft/zod";

export type GroupForm = z.infer<typeof GroupFormSchema>;

export const UserFormSchema = z.object({});

export const GroupFormSchema = z.object({
  name: z.string().nonempty("nama wajib diisi"),
  role: z.string().nonempty("role wajib diisi"),
  mainPage: z.string().nullish(),
  sideMenuHidden: z.boolean().nullish(),
  isCashier: z.boolean().nullish(),
  includeAccounts: z.array(z.string()).nullish()
});

export const transformGroupInput = GroupFormSchema.transform(({ name, role, ...metadata }): CreateGroupInput => {
  return {
    name,
    role,
    metadata
  };
});

export const transformGroupForm = CreateGroupSchema.transform(({ name, role, metadata }): GroupForm => {
  return {
    name,
    role,
    ...metadata
  };
});
