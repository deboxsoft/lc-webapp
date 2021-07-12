<script>
  import { get } from "svelte/store";
  import Table from "__@comps/Table.svelte";
  import { stores } from "@deboxsoft/accounting-client";

  /**
   *
   * @typedef{import("@deboxsoft/accounting-api").Account} Account
   *
   */

  const { getAccountType } = stores.getAccountContext();
  /**
   * @type {{
   *   id: string,
   *   parentId: string,
   *   name: number
   *  type: string
   * }[]}
   */
  export let dataList = [];

  /**
   * @type {string[]}
   */
  export let errors = [];

  /**
   *
   * @type {function(): Transaction[]}
   */
  export const submit = () => {
    return dataList.map((_, index) => ({
      id: _.id,
      name: _.name,
      isParent: !_.parentId,
      type: _.type,
      parentId: _.parentId
    }));
  };

  const getClassificationAccount = (type) => {
    const accountType = get(getAccountType({type}));
    return accountType ? accountType.label : "-"
  }
</script>

<Table>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell text-center id">kode</div>
    <div class="dbx-cell text-center parent">induk</div>
    <div class="dbx-cell">nama</div>
    <div class="dbx-cell text-center account">klasifikasi</div>
  </div>
  {#each dataList as item, index}
    <div class="dbx-tr {errors.includes(index) && `error`}">
      <div class="dbx-cell text-center id">{item.id || ""}</div>
      <div class="dbx-cell text-center parent">{item.parentId || ""}</div>
      <div class="dbx-cell">{item.name || ""}</div>
      <div class="dbx-cell text-center type">{getClassificationAccount(item.type)}</div>
    </div>
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

  .account {
    flex: 0 0 250px;
    overflow: unset;
    height: 37px;
  }
</style>
