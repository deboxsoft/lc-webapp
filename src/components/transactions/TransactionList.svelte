<script>
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";

  /**
   * @type{import("@deboxsoft/accounting-api").Transaction}
   */
  export let transaction;
</script>

<table class="table">
  <thead>
  <tr>
    <th style="width: 100px">Kode</th>
    <th>Akun Perkiraan</th>
    <th style="width: 150px">Jumlah Debit</th>
    <th style="width: 150px">Jumlah Kredit</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>{transaction.accountId || "-"}</td>
    <td><CellAccount id={transaction.accountId} /></td>
    <td><CellNumber value={transaction.amount} /></td>
    <td class="text-right">-</td>
  </tr>
  {#each transaction.creditAccounts as accountAmount, index (accountAmount.index)}
    <tr>
      <td>{accountAmount.id || "-"}</td>
      <td><CellAccount id={accountAmount.id} /></td>
      <td class="text-right">-</td>
      <td><CellNumber value={accountAmount.amount} /></td>
    </tr>
  {/each}
  </tbody>
</table>
