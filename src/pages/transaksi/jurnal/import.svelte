<!--routify:options title="Import Statement"-->
<script>
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { goto, params } from "@roxi/routify";
  import FormImport from "__@comps/forms/FormImport.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import TablePreview from "./_tables/TablePreview.svelte";
  import { sanitizeNumber, sanitizeAccount, sanitizeString, parseDate } from "__@root/utils";
  import CellRp from "__@comps/CellRp.svelte";

  const { loading, notify } = getApplicationContext();
  const { getAccount, accountStore } = stores.getAccountContext();
  const { import: importTransaction, transactionTypeStore } = stores.getTransactionContext();

  // tranform step from csv
  const transformStep = (output) => {
    return (result, self) => {
      const date = parseDate(result.data[0]);
      if (date) {
        output.push({
          date,
          no: sanitizeString(`${result.data[1]}`),
          description: sanitizeString(`${result.data[2]}`),
          amount: sanitizeNumber(result.data[3]),
          accountId: sanitizeAccount(result.data[4])
        });
      }
    };
  };

  /**
   *
   * @type {"journal" | "payment" | "cashier"}
   */
  const action = $params.action;
  const title = action === "cashier" ? "Impor Transaksi Kasir" : "Impor Transaksi Pembayaran";
  let fileLoaded = false;
  let files = writable([]);
  let submitting = false;
  let errors = [];
  let balance = 0;
  let accountId,
    accountsCash = writable([]);
  let submit, openDialog, closeDialog, isPreview;

  $: account = getAccount(accountId);
  // const parentAccountsCash = ["1010100", "1010200", "1010300", "1010400"];
  $loading = true;
  onMount(() => {
    openDialog();
    $loading = false;
  });

  function getAccountsCash(e) {
    return derived(accountStore, (_ = []) => {
      return _.filter((__) => {
        return !__.isParent && /^101/.test(__.parentId);
      });
    });
  }

  $: accountsCash = getAccountsCash(accountStore);

  async function submitHandler() {
    // filter
    errors = [];
    const inputs = submit();
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
      balance = 0;
      errors = [];
      listData.forEach((_, index) => {
        if (!(_.date || _.amount || _.accountId)) {
          errors.push(index);
        }
        balance += parseFloat(_.amount);
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
  <svelte:fragment slot="intro">
    {#if action === "cashier"}
      <div class="row form-group">
        <label class="col-form-label col-md-2" for="accountId">Akun Kas yang didebit</label>
        <div class="col-md-10 d-inline-flex align-items-center">
          : <AccountSelect class="ml-1" id="accountId" bind:accountId accountStore={accountsCash} />
        </div>
      </div>
    {:else if action === "payment"}
      <div class="row form-group">
        <label class="col-form-label col-md-2" for="accountId">Akun Kas yang dikredit</label>
        <div class="col-md-10 d-inline-flex align-items-center">
          : <AccountSelect class="ml-1" id="accountId" bind:accountId accountStore={accountsCash} />
        </div>
      </div>
    {/if}
    <div class="row">
      <div class="col-md-2">Saldo</div>
      <div class="col-md-10 d-inline-flex align-items-center">
        : <div style="width: 150px"><CellRp class="ml-1" value={$account && $account.balance} /></div>
      </div>
    </div>
    {#if isPreview}
      <div class="row">
        <div class="col-form-label col-md-2">Total {action === "cashier" ? "Pemasukan" : "Pengeluaran"}</div>
        <div class="col-md-10 d-inline-flex align-items-center">
          : <div style="width: 150px"><CellRp class="ml-1" value={balance} /></div>
        </div>
      </div>
    {/if}
  </svelte:fragment>

  <!-- preview -->
  <TablePreview bind:submit {action} dataList={fileData} {accountId} bind:errors />
</FormImport>
