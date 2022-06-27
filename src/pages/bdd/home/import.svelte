<!--routify:options title="Import BDD"-->
<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import FormImport from "__@comps/forms/FormImport.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import TablePreview from "../_components/TablePreview.svelte";
  import {
    sanitizeNumber,
    sanitizeString,
    parseDate,
    filteringAccountExpenseAmortization,
    filteringAccountAccumulationAmortization
  } from "__@root/utils";
  import { getAuthenticationContext } from "__@modules/users";

  const { loading, notify } = getApplicationContext();
  const { getAccount, getAccountLeaf, accountStore } = stores.getAccountContext();
  const { authenticationStore, getProfile } = getAuthenticationContext();
  const { import: importBdd } = stores.getBddContext();

  // tranform step from csv
  const transformStep = (output) => {
    let i = 0;
    return (result, self) => {
      const date = parseDate(result.data[4]);
      if (date) {
        output.push({
          id: i,
          dateStart: date,
          name: sanitizeString(result.data[0]),
          category: sanitizeString(result.data[1]),
          monthLife: sanitizeNumber(result.data[3]),
          amount: sanitizeNumber(result.data[2])
        });
        i++;
      }
    };
  };

  const title = "Impor BDD";
  let fileLoaded = false,
    files = writable([]),
    submitting = false,
    errors = [],
    balance = 0,
    expenseAccount,
    amortizationAccount,
    submit,
    openDialog,
    closeDialog,
    isPreview;

  function getAccounts(accountType) {
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "expense": {
        return filteringAccountExpenseAmortization(accountStore);
      }
      case "accumulation": {
        return filteringAccountAccumulationAmortization(accountStore);
      }
      default: {
        return accountStore;
      }
    }
  }

  $loading = true;
  onMount(() => {
    openDialog();
    $loading = false;
  });

  async function submitHandler(_data) {
    // filter
    errors = [];
    const profile = await getProfile();
    const inputs = _data.map(({ id, ..._ }) => {
      const userId = profile.session.userId;
      return {
        userId,
        amortizationAccount,
        expenseAccount,
        ..._
      };
    });
    if (!errors || errors.length === 0) {
      await importBdd(inputs);
      $goto("./");
      $loading = false;
    } else {
      throw errors;
    }
  }

  /**
   *
   * @param listData {*[]}
   */
  function previewHandler(listData) {
    if (listData) {
      errors = [];
      listData.forEach((_, index) => {
        if (!_.date || !Number.isFinite(_.amount) || !_.oppositeAccountId) {
          errors.push(index);
        }
      });
    }
  }

  function closeHandler() {
    fileLoaded = false;
    files.set([]);
    $goto("./");
  }
</script>

<FormImport
  bind:fileLoaded
  bind:files
  bind:isPreview
  bind:errors
  bind:openDialog
  bind:closeDialog
  let:fileData
  {title}
  {transformStep}
  onClose={closeHandler}
  onPreview={previewHandler}
  onSubmit={submitHandler}
>
  <!-- form upload  -->
  <div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1" slot="info">
    <dl class="row form-group">
      <dt class="col-sm-3 mb-0 d-flex align-items-center">Akun Biaya Amortisasi</dt>
      <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
        <span class="d-flex w-75 align-items-center">
          : <AccountSelect
            class="ml-1 mr-2"
            id="expenseAccount"
            name="expenseAccount"
            bind:accountId={expenseAccount}
            accountStore={getAccounts("expense")}
          />
        </span>
      </p>
    </dl>
    <dl class="row form-group">
      <dt class="col-sm-3 mb-0 d-flex align-items-center">Akun Akumulasi BDD</dt>
      <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
        <span class="d-flex w-75 align-items-center">
          : <AccountSelect
            class="ml-1 mr-2"
            id="amortizationAccount"
            name="amortizationAccount"
            bind:accountId={amortizationAccount}
            accountStore={getAccounts("accumulation")}
          />
        </span>
      </p>
    </dl>
    {#if !isPreview}
      <dl class="row mb-0">
        <dt class="col-sm-3 mb-0">Download Template</dt>
        <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
          :<a href={`/templates/bdd.csv`} class="ml-1" target="_self">bdd.csv</a>
        </p>
      </dl>
    {/if}
  </div>

  <!-- preview -->
  <TablePreview dataList={fileData} bind:errors />
</FormImport>
