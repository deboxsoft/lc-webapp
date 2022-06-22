<!--routify:options title="Import Statement"-->
<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import FormImport from "__@comps/forms/FormImport.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import TablePreview from "./_components/TablePreview.svelte";
  import { sanitizeNumber, sanitizeAccount, sanitizeString, parseDate } from "__@root/utils";
  import { getAuthenticationContext } from "__@modules/users";
  import InputCheckSwitchery from "__@comps/forms/InputCheckSwitchery.svelte";

  const { loading, notify } = getApplicationContext();
  const { getAccount, getAccountLeaf, accountStore } = stores.getAccountContext();
  const { authenticationStore, getProfile } = getAuthenticationContext();
  const { import: importTransaction } = stores.getTransactionContext();

  // tranform step from csv
  const transformStep = (output) => {
    let i = 0;
    return (result, self) => {
      const date = parseDate(result.data[0]);
      if (date) {
        output.push({
          id: i,
          date,
          no: sanitizeString(`${result.data[1]}`),
          description: sanitizeString(`${result.data[2]}`),
          oppositeAccountId: sanitizeAccount(result.data[3]),
          amount: sanitizeNumber(result.data[4])
        });
        i++;
      }
    };
  };

  const title = "Impor Transaksi";
  let fileLoaded = false,
    files = writable([]),
    submitting = false,
    errors = [],
    balance = 0,
    accountId,
    submit,
    openDialog,
    closeDialog,
    isPreview,
    isCredit = false;

  $: account = getAccount(accountId);
  // const parentAccountsCash = ["1010100", "1010200", "1010300", "1010400"];
  $loading = true;
  onMount(() => {
    openDialog();
    $loading = false;
  });

  async function submitHandler(_data) {
    // filter
    errors = [];
    const profile = await getProfile();
    const inputs = _data.map(({ id, oppositeAccountId, ..._ }) => {
      const userId = profile.session.userId;
      return {
        type: "JOURNAL",
        userId,
        accountId,
        ..._,
        oppositeAccounts: [
          {
            id: oppositeAccountId,
            amount: _.amount
          }
        ]
      };
    });
    if (!errors || errors.length === 0) {
      await importTransaction(inputs);
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

  function switchIsCreditHandler({ detail }) {
    isCredit = detail;
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
  <svelte:fragment slot="info">
    <div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1">
      <dl class="row form-group">
        <dt class="col-sm-3 mb-0 d-flex align-items-center">Akun {isCredit ? "Kredit" : "Debit"}</dt>
        <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
          <span class="d-flex w-75 align-items-center">
            : <AccountSelect class="ml-1 mr-2" id="accountId" bind:accountId {accountStore} />
            <InputCheckSwitchery
              class="mt-auto mb-auto"
              name="isCredit"
              label="kredit"
              on:change={switchIsCreditHandler}
            />
          </span>
        </p>
      </dl>
      {#if !isPreview}
        <dl class="row mb-0">
          <dt class="col-sm-3 mb-0">Download Template</dt>
          <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
            :<a href={`/templates/jurnal.csv`} class="ml-1" target="_self">jurnal.csv</a>
          </p>
        </dl>
      {/if}
    </div>
  </svelte:fragment>

  <!-- preview -->
  <TablePreview {isCredit} dataList={fileData} {accountId} bind:errors />
</FormImport>
