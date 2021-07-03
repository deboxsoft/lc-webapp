<!--routify:options title="Buku Besar"-->
<script>
  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableAccountBalance from "./_components/TableAccountBalance.svelte";
  import ComboxField from "../../../components/forms/ComboxField.svelte";

  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Buku Besar" });

  let isBalanceFixed = false;
  let cbValue;
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
    isBalanceFixed = (cbValue === itemsComboBox[1].id);
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <ComboxField class="breadcrumb-elements-item" name="balanceType" items={itemsComboBox} bind:value={cbValue} on:change={cbHandler} />
  </svelte:fragment>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1">
      <TableAccountBalance bind:isBalanceFixed />
    </div>
  </div>
</PageLayout>
