<!--routify:options title="Import Statement"-->
<script>
  import dayjs from "dayjs";
  import { goto } from "@roxi/routify";
  import FormImport from "__@comps/forms/FormImport.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { writable, get, derived } from "svelte/store";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";

  const { loading: loadingApp, notify } = getApplicationContext();
  const { getAccount, accountStore } = stores.getAccountContext();
  const { import: importTransaction, transactionTypeStore } = stores.getTransactionContext();

  /**
   *
   * @type {"journal" | "payment" | "cashier"}
   */
  export let action = "journal";

  let fileLoaded = false;
  let isPreview = false;
  let fileData = writable(undefined);
  let files = writable([]);
  let itemsSelected;
  let loading = false;
  let errors = [];
  let accountId;

  function getAccountsCash() {
    return derived(accountStore, (_) => {
      return _.filter((__) => !__.isParent && /^101/.test(_.id));
    });
  }

  async function submitHandler() {
    $loadingApp = true;
    try {
      // filter
      errors = [];
      const statements = $fileData.filter((_, index) => {
        if ($itemsSelected.includes(index)) {
          const account = get(getAccount(_.accountId));
          if (!account || (!_.in && !_.out)) {
            errors.push(index);
          }
          return true;
        }
        return false;
      });
      if (!errors || errors.length === 0) {
        const _statements = statements.map(({ date, ...data }) => ({
          ...data,
          date: dayjs(date, "DD/MM/YY").toDate()
        }));
        await importStatement($bank.id, _statements);
        $itemsSelected = [];
        notify("data berhasil tersimpan", "success");
        $goto("./");
        $loadingApp = false;
      } else {
        notify("data belum lengkap", "error");
      }
    } catch (e) {
      // notify(e.message, "error");
    } finally {
      $loadingApp = false;
    }
  }

  function previewHandler() {
    isPreview = true;
  }

  function backHandler() {
    isPreview = false;
    fileLoaded = false;
    files.set([]);
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<FormImport
  bind:fileLoaded
  bind:fileData
  bind:isPreview
  bind:files
  bind:itemsSelected
  bind:errors
  onPreview={previewHandler}
  onClose={closeHandler}
  onSubmit={submitHandler}
>
  <!-- form upload  -->
  <div slot="intro">
    {#if action === "cashier"}
      <div class="form-group">
        <label for="accountId">Akun Kas yang didebit</label>
        <AccountSelect id="accountId" bind:accountId accountStore={getAccountsCash()} />
      </div>
    {:else if action === "payment"}
      <div class="form-group">
        <label for="accountId">Akun Kas yang didebit</label>
        <AccountSelect id="accountId" bind:accountId accountStore={getAccountsCash()} />
      </div>
    {/if}
  </div>

  <!-- preview -->
  <div />
</FormImport>
