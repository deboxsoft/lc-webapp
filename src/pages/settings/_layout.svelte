<!--routify:options title="Aplikasi"-->
<script>
  import { url, isActive } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getAuthenticationContext, createUserContext, createAccessControlContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "__@comps/loader/Loader.svelte";

  /**
   *
   * @type {ApplicationContext}
   */
  const { loading, apiUrl, fetchGraphql } = getApplicationContext();
  const { find, findGroup } = createUserContext({ apiUrl, fetchGraphql });
  const authContext = getAuthenticationContext();
  const { load, grants } = createAccessControlContext({ authContext, apiUrl, fetchGraphql });

  const boot = () => {
    $loading = true;
    const userPromise = find();
    const groupPromise = findGroup();
    const aclPromise = load();
    return Promise.all([groupPromise, userPromise, aclPromise]).then((_) => {
      $loading = false;
    });
  };
  boot();

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "pengaturan" });

  let show = true;

  function togglerCollapseHandler() {
    show = !show;
  }
</script>
<slot />