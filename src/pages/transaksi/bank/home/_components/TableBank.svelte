<script lang="ts">
  import { getBankContext} from "__@modules/accounting";
  import Table from "__@comps/Table.svelte";
  // import CellRp from "__@comps/CellRp.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import MenuListBank from "./MenuListBank.svelte";
  import Loader from "__@comps/loader/Loader.svelte";

  const { bankStore, find } = getBankContext();
  let loading = true;
  find().then(() => {
    loading = false;
  })

</script>

{#if loading}
  <Loader />
{:else}
<Table items={$bankStore} let:item={bank}>
    <div class="dbx-thead" slot="header">
      <div class="dbx-cell bank">Bank</div>
      <div class="dbx-cell bank">No Rekening</div>
      <div class="dbx-cell bank">Nama Rekening</div>
      <div class="dbx-cell">Akun Perkiraan</div>
<!--      <div class="dbx-cell balance">Saldo</div>-->
<!--      <div class="dbx-cell balance">Saldo Bank</div>-->
<!--      <div class="dbx-cell status">Status</div>-->
      <div class="dbx-cell -menu-list"></div>
    </div>
  <div class="dbx-tr">
    <div class="dbx-cell bank">{bank.bank || ''}</div>
    <div class="dbx-cell bank">{bank.noAccountBank || ''}</div>
    <div class="dbx-cell bank">{bank.nameAccountBank || ''}</div>
    <div class="dbx-cell">
      <CellAccount id={bank.accountId} />
    </div>
<!--    <div class="dbx-cell text-right balance">-->
<!--      <CellRp value={bank.balance} />-->
<!--    </div>-->
    <!--  TODO saldo account -->
<!--    <div class="dbx-cell text-right">-->
      <!--    <CellRp value={} />-->
<!--    </div>-->
<!--    <div class="dbx-cell text-center">-->
<!--    <span-->
<!--      class="badge"-->
<!--      class:badge-danger={bank.status !== 'RECONCILED'}-->
<!--      class:badge-success={bank.status === 'RECONCILED'}>{bankReconciliation.status || 'UNRECONCILED'}</span>-->
<!--    </div>-->
    <div class="dbx-cell -menu-list" style="width: 30px">
      <MenuListBank id={bank.id} />
    </div>
  </div>
</Table>
  {/if}

<style lang="scss">
  .bank {
    flex: 0 0 150px;
  }

  .balance {
    flex: 0 0 200px;
  }

  .status {
    flex: 0 0 90px;
  }
</style>
