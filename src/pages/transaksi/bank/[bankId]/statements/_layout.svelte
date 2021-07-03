<!--routify:options title="Rekonsiliasi detail"-->
<script>
  import { sortUtilsFunc } from "__@root/utils";
  import { url, params } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";

  import TableStatementBank from "./_components/TableStatementBank.svelte";
  // import DatePickr from "__@comps/DatePickr.svelte";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Rekonsiliasi Detail" });
  const applicationContext = getApplicationContext();
  const { notify, loading: loadingApp } = applicationContext;

  let loading = true;
  const { getBank } = stores.getBankContext();
  const { findStatement, bank, reconcile, bankStatementStore } = stores.createBankStatementContext({
    bank: getBank($params.bankId),
    ...applicationContext
  });
  let itemsSelected;
  let errors = [];
  $: bankStatementList = $bankStatementStore;

  if ($bank.id && loading) {
    findStatement($bank.id, {}).then(() => {
      loading = false;
    });
  }

  async function reconcileHandler() {
    $loadingApp = true;
    try {
      // filter
      const statements = [];
      let index = 0;
      errors = [];
      for (const { status, ...statement } of bankStatementList) {
        if ($itemsSelected.includes(index)) {
          const amount = statement.in || statement.out;
          if (!statement.accountId || !amount) {
            errors.push(index);
          }
          statements.push(statement);
        }
        index++;
      }
      statements.sort(sortUtilsFunc("id", "desc"));
      if (statements.length > 0 && !(errors.length > 0)) {
        const result = await reconcile(statements);
        statements.forEach((_, index) => {
          statements[index] = result[index];
        });
        // reset check all
        $itemsSelected = [];
        notify("reconcile data bank telah berhasil", "success");
      } else if (statements.length === 0) {
        notify("Belum ada data yang dipillih", "error");
      } else {
        notify("Terdapat data yang belum lengkap", "error");
      }
    } catch (e) {
      // console.error(e);
      // notify(e.message, "error");
    } finally {
      $loadingApp = false;
    }
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <a href={$url("./import")} class="breadcrumb-elements-item">
      <i class="icon-file-upload2 mr-1" />
      Import
    </a>
    <a href="/#" target="_self" on:click|preventDefault={reconcileHandler} class="breadcrumb-elements-item" >
      <i class="icon-file-spreadsheet2 mr-1" />
      Rekonsiliasi
    </a>
  </svelte:fragment>
  <div class="card flex-column flex-1 d-flex">
    <div class="card-body d-flex flex-column flex-1">
      <TableStatementBank bind:loading bind:itemsSelected bind:bankStatementList bind:errors />
    </div>
  </div>
</PageLayout>
<slot />
