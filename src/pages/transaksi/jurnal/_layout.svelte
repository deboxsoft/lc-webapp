<!--routify:options title="Transaksi Jurnal"-->
<script>
  import { tick, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableTransaction from "./_tables/TableTransaction.svelte";
  import FormFilter from "./_forms/FormFilter.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { createAclContext } from "./_acl-context";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";

  const { getProfile } = getAuthenticationContext();
  const { readGranted, readOwnGranted, createGranted, createCashierGranted, createPaymentGranted } = createAclContext();
  if (!readGranted && !readOwnGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  const applicationContext = getApplicationContext();
  stores.createBalanceContext(applicationContext);
  const accountContext = stores.getAccountContext();
  setBreadcrumbContext({ path: $url("./"), title: "jurnal" });
  const { load, findPage, transactionStore, transactionPageInfo, subscribe } = stores.getTransactionContext();
  onMount(() => {
    return subscribe();
  });
  const { loading } = applicationContext;

  let filter = writable({});

  let openFilterDialog;
  let closeFilterDialog;
  let clearFilter;
  let textFilter = undefined;
  let submitFilter;
  let submitting;
  let userId;
  let transactions = [];

  init();
  $: {
    if ($transactionStore) {
      filtering();
    }
  }

  function filtering() {
    if ($transactionStore) {
      const _reduce = (result, transaction) => {
        if (textFilter) {
          const regex = new RegExp(`.*${textFilter.toLowerCase()}.*`);
          if (regex.test(transaction.description.toLowerCase())) {
            result.push(transaction);
          }
        } else {
          result.push(transaction);
        }
        return result;
      };
      transactions = $transactionStore.reduce(_reduce, []);
    }
  }

  function searchHandler() {
    filtering();
  }

  async function init() {
    $loading = true;
    if (!readOwnGranted && readOwnGranted) {
      const profile = await getProfile();
      userId = profile.session.userId;
    }
    await load({ filter: $filter, pageCursor: {} });
    $loading = false;
  }

  async function filterHandler(opts) {
    const _filter = Object.assign({ userId }, submitFilter());
    textFilter = undefined;
    $loading = true;
    submitting = true;
    await findPage(
      {
        pageCursor: opts?.more
          ? {
              next: $transactionPageInfo.next
            }
          : {},
        filter: _filter
      },
      { more: opts?.more }
    );
    tick().then(() => {
      filtering();
      submitting = false;
      $loading = false;
      closeFilterDialog();
    });
  }

  function syncHandler() {
    filterHandler();
  }

  export function infiniteHandler() {
    filterHandler({ more: true });
  }
</script>

<FormFilter
  {filter}
  bind:closeDialog={closeFilterDialog}
  bind:openDialog={openFilterDialog}
  bind:clearFilter
  bind:submitFilter
>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-light ml-1" on:click={clearFilter}>
      <i class="icon-filter4 mr-2" />
      Clear
    </button>
    <button type="button" class="btn btn-primary ml-1" on:click={filterHandler}>
      <i class="icon-filter4 mr-2" />
      Filter
    </button>
  </svelte:fragment>
</FormFilter>
<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2 mr-1" />
        Posting
      </a>
    {/if}
    <a href="#/" target="_self" on:click={syncHandler} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
    <a
      href="/#"
      target="_self"
      on:click|preventDefault={() => {
        openFilterDialog();
      }}
      class="breadcrumb-elements-item"
    >
      <i class="icon-filter3 mr-1" />
      Filter
    </a>
    <a href={$url("./import")} class="breadcrumb-elements-item">
      <i class="icon-file-upload2 mr-1" />
      Impor
    </a>
    <a href={$url("./export")} class="breadcrumb-elements-item">
      <i class="icon-file-download2 mr-1" />
      Ekspor
    </a>
  </svelte:fragment>
  <div class="header-elements" slot="header-elements" />
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1 flex-column">
      <TableTransaction {filter} {transactions} {submitting} {infiniteHandler} />
    </div>
  </div>
  <slot />
</PageLayout>
