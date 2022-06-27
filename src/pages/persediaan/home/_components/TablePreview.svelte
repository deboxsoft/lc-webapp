<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";

  /**
   * @type {import("@deboxsoft/accounting-api").Product[]}
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
    <th width="50">No</th>
    <th>Nama</th>
    <th>Satuan</th>
    <th>Harga Barang</th>
    <th>Stock</th>
  </tr>
  {#each dataList as item, index}
    <tr class={errors.includes(index) && `error`}>
      <td>{item.no || ""}</td>
      <td>{item.name || ""}</td>
      <td>{item.unit || ""}</td>
      <td>
        <CellNumber value={item.price} />
      </td>
      <td>
        <CellNumber value={item.available} format="number" />
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
