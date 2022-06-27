<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellDate from "__@comps/CellDate.svelte";

  /**
   *
   * @typedef{import("@deboxsoft/accounting-api").Bdd} Bdd
   *
   */

  const { getAccountLeaf } = stores.getAccountContext();
  /**
   * @type {Bdd[]}
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
    <th>Keterangan</th>
    <th>Jenis</th>
    <th>JK Waktu</th>
    <th>Nilai BDD</th>
  </tr>
  {#each dataList as item, index}
    <tr class={errors.includes(index) && `error`}>
      <td><CellDate date={item.dateStart} /></td>
      <td>{item.name || ""}</td>
      <td>{item.category || ""}</td>
      <td>
        <CellNumber value={item.monthLife} format="number" />
      </td>
      <td>
        <CellNumber value={item.amount} />
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
