<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellDate from "__@comps/CellDate.svelte";

  /**
   * @type {import("@deboxsoft/accounting-api").Inventory[]}
   */
  export let dataList = [];

  /**
   * @type {string[]}
   */
  export let errors = [];

  /**
   *
   * @type {function(): any[]}
   */
  export const submit = () => {
    return dataList;
  };
</script>

<Table class="table text-nowrap">
  <tr slot="header">
    <th width="90">Tgl Perolehan</th>
    <th>Nama Aset</th>
    <th>Jumlah</th>
    <th>Harga Satuan</th>
    <th>Harga Perolehan</th>
  </tr>
  {#each dataList as item, index}
    <tr class={errors.includes(index) && `error`}>
      <td><CellDate date={item.datePurchase} /></td>
      <td>{item.name || ""}</td>
      <td>{item.quantity || ""}</td>
      <td>
        <CellNumber value={item.priceItem} />
      </td>
      <td>
        <CellNumber value={item.priceItem * item.quantity} />
      </td>
    </tr>
  {/each}
</Table>

<style lang="scss">
  .id {
    flex: 0 0 200px;
  }

  .parent {
    flex: 0 0 200px;
  }

  .type {
    flex: 0 0 200px;
  }

  .startBalance {
    flex: 0 0 250px;
  }

  .account {
    flex: 0 0 250px;
    overflow: unset;
    height: 37px;
  }
</style>
