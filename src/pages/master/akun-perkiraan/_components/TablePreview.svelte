<script>
  import Table from "__@comps/Table.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";

  /**
   *
   * @typedef{import("@deboxsoft/accounting-api").Account} Account
   *
   */

  /**
   * @type {import("@deboxsoft/accounting-api").Account[]}
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
    return dataList.map((_, index) => ({
      id: _.id,
      name: _.name,
      isParent: !_.parentId,
      startBalance: _.startBalance,
      parentId: _.parentId
    }));
  };
</script>

<Table>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell text-center id">kode</div>
    <div class="dbx-cell text-center parent">induk</div>
    <div class="dbx-cell">nama</div>
    <div class="dbx-cell startBalance">saldo awal</div>
  </div>
  {#each dataList as item, index}
    <div class="dbx-tr {errors.includes(index) && `error`}">
      <div class="dbx-cell text-center id">{item.id || ""}</div>
      <div class="dbx-cell text-center parent">{item.parentId || ""}</div>
      <div class="dbx-cell">{item.name || ""}</div>
      <div class="dbx-cell startBalance">
        <CellNumber value={item.startBalance} />
      </div>
    </div>
  {/each}
</Table>

<style lang="scss">
  .id {
    flex: 0 0 150px;
  }

  .parent {
    flex: 0 0 150px;
  }

  .type {
    flex: 0 0 175px;
  }

  .startBalance {
    flex: 0 0 175px;
  }

  .account {
    flex: 0 0 150px;
    overflow: unset;
    height: 37px;
  }
</style>
