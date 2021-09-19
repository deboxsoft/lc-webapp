import { getAuthenticationContext } from "__@modules/users";

export const createAclContext = () => {
  const auth = getAuthenticationContext();
  return () => {
    const query = auth.getQuery("bdd");
    const createGranted = query.create().granted;
    const readGranted = query.read().granted;
    const updateGranted = query.update().granted;
    const removeGranted = query.delete().granted;
    return {
      auth,
      createGranted,
      readGranted,
      updateGranted,
      removeGranted
    };
  };
};
