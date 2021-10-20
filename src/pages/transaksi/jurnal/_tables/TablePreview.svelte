<script>
  import dayjs from "dayjs";
  import Table from "__@comps/Table.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import { writable } from "svelte/store";

  /**
   *
   * @typedef{import("@deboxsoft/accounting-api").Transaction} Transaction
   *
   */
  /**
   * @type {{
   *   date: string;
   *   description: string;
   *   amount: number;
   *   accountId: string;
   * }[]}
   */
  export let dataList = [];

  /**
   * @type {string[]}
   */
  export let errors = [];

  /**
   * @type {string}
   */
  export let accountId;

  /**
   * @type {"cashier" | "payment"}
   */
  export let action;

  export let accounts = writable([]);

  /**
   *
   * @type {function(): Transaction[]}
   */
  export const submit = () => {
    return dataList.map((_) => ({
      no: _.no,
      dateTransaction: _.date,
      description: _.description,
      accountId: action === "cashier" ? accountId : _.accountId,
      amount: _.amount,
      creditAccounts: [
        {
          id: action === "cashier" ? _.accountId : accountId,
          amount: _.amount
        }
      ]
    }));
  };
</script>

<Table>
  <div class="dbx-thead" slot="header">
    <div class="dbx-cell text-center date">Tanggal</div>
    <div class="dbx-cell no">No</div>
    <div class="dbx-cell">Diskripsi</div>
    <div class="dbx-cell account">Account</div>
    <div class="dbx-cell d-sm-none d-md-flex amount">Jumlah</div>
  </div>
  {#each dataList as item, index (item.id)}
    <div class="dbx-tr {errors.includes(index) && `error`}">
      <div class="dbx-cell text-center date">
        {dayjs(item.date).format("DD-MMM-YYYY") || ""}
      </div>
      <div class="dbx-cell no">{item.no || ""}</div>
      <div class="dbx-cell">{item.description || ""}</div>
      <div class="dbx-cell account">
        <CellAccount id={item.accountId} />
      </div>
      <div class="dbx-cell text-right d-sm-none d-md-none d-xl-flex amount"><CellNumber value={item.amount} /></div>
    </div>
  {/each}
</Table>

<style lang="scss">
  .dbx-tr {
    height: 45px;
    .dbx-cell {
      line-height: 40px;
    }
  }

  .no {
    flex: 0 0 200px;
  }

  .date {
    flex: 0 0 100px;
  }

  .amount {
    flex: 0 0 125px;
  }

  .account {
    flex: 0 0 250px;
    overflow: unset;
    height: 37px;
  }
</style>
