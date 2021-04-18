<!--routify:options title="Akun Perkiraan"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import { getAccountContext } from "__@modules/accounting";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import TableAccount from "./_components/TableAccount.svelte";
  import { sortUtilsFunc } from "__@root/utils";

  const { setBreadcrumbContext } = getBreadcrumbStore();
  const { accountStore, getAccountType } = getAccountContext();

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
          <i class="fal fa-search" />
        </div>
      </div>
    </div>
    <a href={$url("./create")} class="btn btn-primary btn-icon"><i class="fal fa-plus" /></a>
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
</PageLayout>
<slot />
