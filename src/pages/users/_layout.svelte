<!--routify:options title="Pengguna"-->
<script>
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getAuthenticationContext, createUserContext, createAccessControlContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "__@comps/loader/Loader.svelte";
  import { createAclContext } from "__@root/utils";

  /**
   *
   * @type {ApplicationContext}
   */
  const applicationContext = getApplicationContext();
  const { loading, apiUrl, fetchGraphql, fetch } = applicationContext;
  const { find, findGroup } = createUserContext(applicationContext);
  const authContext = getAuthenticationContext();
  const { load, grants } = createAccessControlContext({ authContext, ...applicationContext });
  createAclContext({
    resource: "user"
  });

  let submitting = true;
  const boot = () => {
    $loading = true;
    const userPromise = find();
    const groupPromise = findGroup();
    const aclPromise = load();
    return Promise.all([groupPromise, userPromise, aclPromise]).then((_) => {
      $loading = false;
      submitting = false;
    });
  };
  boot();

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "pengguna" });
</script>

{#if submitting}
  <Loader />
{:else}
  <slot />
{/if}
