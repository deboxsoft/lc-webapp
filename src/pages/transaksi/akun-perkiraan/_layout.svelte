<!--routify:options title="Akun Perkiraan"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import PlusIcon from "__@comps/icons/Plus.svelte";
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
      // if (Array.isArray(account.children)) {
      //   const children = account.children.reduce(getNodes, []);
      //   if (children.length) result.push({ ...account, children });
      // }
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
    <a href={$url("./create")} class="btn bg-primary"><PlusIcon class="mr-2" />Tambah</a>
  </div>
  <div class="card h-100">
    <div class="card-header header-elements-inline">
      <div />
      <div class="header-elements">
        <div class="list-icons">
          <div class="form-group-feedback form-group-feedback-right">
            <input class="form-control input" placeholder="search" on:input={filterHandler} />
            <div class="form-control-feedback text-grey-300">
              <i class="fal fa-search" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body d-flex">
      <TableAccount {accounts} />
    </div>
  </div>
</PageLayout>
<slot />
