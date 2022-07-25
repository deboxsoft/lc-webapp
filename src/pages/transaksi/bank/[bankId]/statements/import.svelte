<!--routify:options title="Import Rekonsiliasi"-->
<script>
  import { onMount } from "svelte";
  import { derived, writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import FormImport from "__@comps/forms/FormImport.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import TablePreview from "./_components/BankStatementTable.svelte";
  import { sanitizeNumber, sanitizeAccount, sanitizeString, parseDate } from "__@root/utils";
  import BankInfo from "./_components/BankInfo.svelte";

  // tranform step from csv
  const transformStep = (output) => {
    let index = 0;
    errors = [];
    return (result, self) => {
      if (index === 0) {
        const accountId = result.data[6];
        if (!accountId || accountId !== $account.id) {
          throw new Error(`Kode Akun Bank '${$account.id}' Tidak sama atau belum diisi di file csv`);
        }
      }
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
      index++;
    };
  };

  const { loading, notify } = getApplicationContext();
  const { getCurrentBalanceAccount } = stores.getBalanceContext();
  const { getAccount } = stores.getAccountContext();
  const { reconcile, bank = writable() } = stores.getBankStatementContext();
  const { setLastBalance } = stores.getBankContext();

  const title = "Rekonsiliasi data bank";
  let fileLoaded = false;
  let isPreview = false;
  let files = writable([]);
  let itemsSelected;
  let submitting = false;
  let errors = [];
  let balanceBank = 0;
  let balanceAccount = 0;
  let submit, openDialog, closeDialog;

  onMount(() => {
    openDialog();
    $loading = false;
  });

  $: account = getAccount($bank.accountId);

  async function submitHandler(_statements) {
    errors = [];
    if (!errors || errors.length === 0) {
      await reconcile($bank.id, _statements);
      setLastBalance($bank.id, balanceBank);
      $goto("./");
    } else {
      throw new DeboxError({
        message: "submit failed"
      });
    }
  }

  /**
   *
   * @param listData {*[]}
   */
  function previewHandler(listData) {
    errors = [];
    if (listData) {
      balanceBank = $bank.balance;
      listData.forEach((_, index) => {
        if (_.date === "" || !_.balance || _.accountId === "" || (!_.in && !_.out) || (_.in && _.out)) {
          errors.push(index);
        }
        balanceBank = _.balance;
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
    <BankInfo account={$account} bank={$bank} isForm={!isPreview} />
  </svelte:fragment>
  <TablePreview preview bind:submit bankStatementList={fileData} bind:errors />
</FormImport>
