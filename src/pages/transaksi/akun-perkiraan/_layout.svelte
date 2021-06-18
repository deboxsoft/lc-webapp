<!--routify:options title="Akun Perkiraan"-->
<script lang="ts">
  import { url, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import TableAccount from "./_components/TableAccount.svelte";
  import { sortUtilsFunc } from "__@root/utils";
  import { createAclContext } from "./_acl-context";

  const { readGranted } = createAclContext();
  const { setBreadcrumbContext } = getBreadcrumbStore();
  const { accountStore, getAccountType } = stores.getAccountContext();
  const { loading } = getApplicationContext();

  if (!readGranted) {
    $goto("/access-denied");
  }

  setBreadcrumbContext({ path: $url("./"), title: "akun-perkiraan" });
  let accounts;

  $: {
    accounts = $accountStore.sort(sortUtilsFunc("id"));
  }

  function filterHandler(e) {
    const text = e.target.value;
    const getNodes = (result, account) => {
      const regex = new RegExp(`.*${text.toLowerCase()}.*`);
      if (regex.test(account.name.toLowerCase())) {
        result.push(account);
        return result;
      }
      return result;
    };

    if (text.length > 0) {
      accounts = $accountStore.reduce(getNodes, []);
    } else {
      accounts = $accountStore;
    }
  }
</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <div class="form-group-feedback form-group-feedback-right">
      <div class="list-icons">
        <input class="form-control input" placeholder="search" on:input={filterHandler} />
        <div class="form-control-feedback text-grey-600">
          <i class="icon-search4" />
        </div>
      </div>
    </div>
    <a href={$url("./create")} class="btn btn-primary btn-icon"><i class="icon-plus2" /></a>
  </div>
  <div class="card d-flex flex-column flex-1">
    <div class="card-header header-elements-inline">
      <div />
      <div class="header-elements" />
    </div>
    <div class="card-body flex-1 flex-column d-flex">
      <TableAccount {accounts} />
    </div>
  </div>
  <slot />
</PageLayout>
