<!--routify:options title="Pengguna"-->
<script>
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getAuthenticationContext, createUserContext, createAccessControlContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "__@comps/loader/Loader.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";

  /**
   *
   * @type {ApplicationContext}
   */
  const { loading, apiUrl, fetchGraphql } = getApplicationContext();
  const { find, findGroup } = createUserContext({ apiUrl, fetchGraphql });
  const authContext = getAuthenticationContext();
  const { load, grants } = createAccessControlContext({ authContext, apiUrl, fetchGraphql });

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
