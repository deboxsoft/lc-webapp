<script>
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";

  /**
   * @type {AccountAmount[]}
   */
  export let dataList = [];
  export let totalPayment = 0;

  $: {
    totalPayment = calcTotal(dataList);
  }

  function calcTotal(_items = []) {
    return _items.reduce((tot, _) => tot + _.amount, 0);
  }
</script>

<table class="table">
  <thead>
    <tr>
      <th width="100">Kode Akun</th>
      <th>Akun Perkiraan</th>
      <th class="text-center" width="200">Nominal</th>
    </tr>
  </thead>
  <tbody>
    {#each dataList as dataItem}
      <tr>
        <td>{dataItem.id}</td>
        <td><CellAccount id={dataItem.id} /></td>
        <td><CellNumber value={dataItem.amount} /></td>
      </tr>
    {/each}
  </tbody>
</table>
