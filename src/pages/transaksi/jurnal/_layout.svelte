<!--routify:options title="Transaksi Jurnal"-->
<script>
  import { tick } from "svelte";
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableTransaction from "./_tables/TableTransaction.svelte";
  import FormFilter from "./_forms/FormFilter.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { createAclContext } from "./_acl-context";
  import { getApplicationContext } from "__@modules/app";
  import Dropdown from "../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../components/DropdownToggle.svelte";
  import FalCashRegister from "@deboxsoft/svelte-icons/fal/FalCashRegister.svelte";
  import FalMoneyBill from "@deboxsoft/svelte-icons/fal/FalMoneyBill.svelte";
  import { getAuthenticationContext } from "../../../modules/users";

  const { getProfile } = getAuthenticationContext();
  const { readGranted, readOwnGranted, createGranted, createCashierGranted, createPaymentGranted } = createAclContext();
  if (!readGranted && !readOwnGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  const applicationContext = getApplicationContext();
  const accountContext = stores.getAccountContext();
  setBreadcrumbContext({ path: $url("./"), title: "jurnal" });
  const { load, findPage, transactionStore } = stores.createTransactionContext({
    accountContext,
    ...applicationContext
  });
  const { loading } = applicationContext;

  let filter = {};
  let openFilterDialog;
  let closeFilterDialog;
  let textFilter = undefined;
  let fetchMor;
  let submitFilter;
  let transactions = [];

  init();
  $: {
    $transactionStore, filtering();
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
    if (readGranted) {
      filter = {};
    } else if (readOwnGranted) {
      const profile = await getProfile();
      filter.userId = profile.session.userId;
    }
    await load({ filter, pageCursor: {} });
    $loading = false;
  }

  async function filterHandler() {
    const _filter = Object.assign(filter, submitFilter && submitFilter());
    textFilter = undefined;
    $loading = true;
    await findPage({
      pageCursor: {},
      filter: _filter
    });
    tick().then(() => {
      filtering();
      $loading = false;
      closeFilterDialog();
    });
  }

  function syncHandler() {
    filterHandler();
  }
</script>

<FormFilter {filter} bind:closeDialog={closeFilterDialog} bind:openDialog={openFilterDialog} bind:submit={submitFilter}>
  <button slot="footer" type="button" class="btn btn-primary ml-1" on:click={filterHandler}>
    <i class="icon-filter4 mr-2" />
    Filter
  </button>
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
      Sinkronisasi
    </a>
    {#if createPaymentGranted || createCashierGranted}
      <Dropdown class="breadcrumb-elements-item dropdown p-0">
        <DropdownToggle class="breadcrumb-elements-item" caret nav>
          <i class="icon-file-upload2 mr-1" />
          Impor
        </DropdownToggle>
        <svelte:fragment slot="menu" let:closeHandler={dropdownClose}>
          {#if createCashierGranted}
            <a href={$url("./import", { action: "cashier" })} class="dropdown-item">
              <FalCashRegister class="mr-3" /> Kasir</a
            >
          {:else if createPaymentGranted}
            <a href={$url("./import", { action: "payment" })} class="dropdown-item">
              <FalMoneyBill class="mr-3" />Pembayaran</a
            >
          {/if}
        </svelte:fragment>
      </Dropdown>
    {/if}
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
    <a href={$url("./export")} class="breadcrumb-elements-item">
      <i class="icon-file-download2 mr-1" />
      Ekspor
    </a>
  </svelte:fragment>
  <div class="header-elements" slot="header-elements">
    <!--    <div class="form-group-feedback form-group-feedback-right">-->
    <!--      <div class="list-icons">-->
    <!--        <input class="form-control input" placeholder="search" on:input={filterHandler} />-->
    <!--        <div class="form-control-feedback text-grey-600">-->
    <!--          <i class="icon-search4" />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1">
      <TableTransaction bind:filter {transactions} />
    </div>
  </div>
  <slot />
</PageLayout>
