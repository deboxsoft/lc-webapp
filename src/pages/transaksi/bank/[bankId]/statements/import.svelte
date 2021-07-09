<!--routify:options title="Import Statement"-->
<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import FormImport from "__@comps/forms/FormImport.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import TablePreview from "./_components/TableStatementBank.svelte";
  import { sanitizeNumber, sanitizeAccount, sanitizeString, parseDate } from "__@root/utils";
  import BankInfo from "./_components/BankInfo.svelte";

  // tranform step from csv
  const transformStep = (output) => {
    return (result, self) => {
      const date = parseDate(result.data[0]);
      if (date) {
        output.push({
          date,
          description: sanitizeString(`${result.data[1]}`),
          in: sanitizeNumber(result.data[2]),
          out: sanitizeNumber(result.data[3]),
          balance: sanitizeNumber(result.data[4]),
          accountId: sanitizeAccount(result.data[5])
        });
      }
    };
  };

  const { loading, notify } = getApplicationContext();
  const { getAccount } = stores.getAccountContext();
  const { importStatement, bank } = stores.getBankStatementContext();

  const title = "Rekonsiliasi data bank";
  let fileLoaded = false;
  let isPreview = false;
  let files = writable([]);
  let itemsSelected;
  let submitting = false;
  let errors = [];
  let balanceBank = 0;
  let balanceAccount = 0;
  let account
  let submit, openDialog, closeDialog;

  $: {
    account = getAccount($bank.accountId);
    $account && (balanceAccount = $account.balance);
    $bank && (balanceBank = $bank.balance)
  }

  onMount(() => {
    openDialog();
    $loading = false;
  });

  async function submitHandler() {
    errors = [];
    if (!errors || errors.length === 0) {
      await importStatement($bank.id, _statements);
      notify("data berhasil tersimpan", "success");
      $goto("./");
    } else {
      notify("data belum lengkap", "error");
    }
  }

  /**
   *
   * @param listData {*[]}
   */
  function previewHandler(listData) {
    errors = [];
    if (listData) {
      balanceAccount = $account.balance;
      balanceBank = $bank.balance;
      listData.forEach((_, index) => {
        console.log(_);
        if (_.date === "" || !_.balance || _.accountId === "" || (!_.in && !_.out) || (_.in && _.out)) {
          errors.push(index);
        }
        balanceBank = _.balance;
        _.in && (balanceAccount += _.in);
        _.out && (balanceAccount -= _.out);
      });
    }
    if (errors.length > 0 || !listData || listData.length === 0) {
      throw new Error("Terjadi kesalahan input data, mohon diperiksa kembali.");
    }
  }

  function closeHandler() {
    fileLoaded = false;
    balanceBank = $bank.balance;
    balanceAccount = $account.balance;
    files.set([]);
    $goto("./");
  }

  function resetHandler() {
    balanceBank = $bank.balance;
    balanceAccount = $account.balance;
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
  onPreview={previewHandler}
  onClose={closeHandler}
  onReset={resetHandler}
  onSubmit={submitHandler}
>
  <svelte:fragment slot="info">
    <BankInfo {account} {bank} {balanceAccount} {balanceBank} />
  </svelte:fragment>
  <TablePreview preview bind:submit bankStatementList={fileData} bind:errors />
</FormImport>
