<!--routify:options title="Buku Besar"-->
<script>
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Dropdown from "../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../components/DropdownToggle.svelte";
  import TableAccountBalance from "./_components/TableAccountBalance.svelte";
  import ComboxField from "../../../components/forms/ComboxField.svelte";
  import { createReportContext } from "./_export";
  import { getApplicationContext } from "__@modules/app";

  const reportContext = createReportContext();
  const { loading } = getApplicationContext();
  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Buku Besar" });

  let isBalanceFixed = false;
  let cbValue;
  let accounts;
  const itemsComboBox = [
    {
      id: "0",
      label: "Saldo Perkiraan"
    },
    {
      id: "1",
      label: "Saldo Fixed"
    }
  ];

  function cbHandler() {
    isBalanceFixed = cbValue === itemsComboBox[1].id;
  }

  const createExportMenuHandler = (close) => ({
    pdf: () => {
      $loading = true;
      reportContext.pdf(
        $accounts,
        (p) => {
          if (p === 1) {
            $loading = false;
          }
        },
        { isBalanceFixed }
      );
      close();
    },
    csv: () => {
      $loading = true;
      reportContext.csv($accounts, { isBalanceFixed });
      $loading = false;
      close();
    },
    print: () => {
      $loading = true;
      reportContext.print($accounts, { isBalanceFixed });
      $loading = false;
      close();
    }
  });
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <div class="breadcrumb-elements-item p-0 my-auto">
      <ComboxField name="balanceType" items={itemsComboBox} bind:value={cbValue} on:change={cbHandler} />
    </div>
    <Dropdown class="breadcrumb-elements-item dropdown p-0">
      <DropdownToggle class="breadcrumb-elements-item" caret nav>
        <i class="icon-file-download2 mr-1" />
        Ekspor
      </DropdownToggle>
      <svelte:fragment slot="menu" let:closeHandler={dropdownClose}>
        <a
          href="/#"
          target="_self"
          on:click|preventDefault={createExportMenuHandler(dropdownClose).pdf}
          class="dropdown-item"
        >
          <i class="icon-file-pdf" />
          Download PDF</a
        >
        <a
          href="/#"
          target="_self"
          on:click|preventDefault={createExportMenuHandler(dropdownClose).csv}
          class="dropdown-item"
        >
          <i class="icon-file-excel" />
          Download CSV</a
        >
        <a
          href="/#"
          target="_self"
          on:click|preventDefault={createExportMenuHandler(dropdownClose).print}
          class="dropdown-item"
        >
          <i class="icon-printer2" />
          Print</a
        >
      </svelte:fragment>
    </Dropdown>
  </svelte:fragment>
  <div class="card d-flex flex-1">
    <div class="card-body d-flex flex-1 flex-column">
      <TableAccountBalance bind:accounts bind:isBalanceFixed />
    </div>
  </div>
</PageLayout>
