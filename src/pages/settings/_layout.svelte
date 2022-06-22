<!--routify:options title="Setting"-->
<script>
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getAuthenticationContext, createUserContext, createAccessControlContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";

  /**
   *
   * @type {ApplicationContext}
   */
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const { find, findGroup } = createUserContext(applicationContext);
  const authContext = getAuthenticationContext();
  const { load, grants } = createAccessControlContext(applicationContext);

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
