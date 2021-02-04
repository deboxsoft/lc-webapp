<!--routify:options title="tabel"-->
<script lang="ts">
  import { url, ready } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import PlusIcon from "__@comps/icons/Plus.svelte";
  import BarsIcon from "__@comps/icons/Bars.svelte";

  import { getAccountContext } from "__@modules/transaksi";

  const { accountStore, accountTypeStore, getAccountType } = getAccountContext();
</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <a href={$url('./post')} class="btn bg-blue"><PlusIcon class="mr-2" />Tambah</a>
  </div>
  <div class="card">
<!--    <div class="card-header header-elements-inline">-->
<!--    </div>-->
    <div class="card-body">
      <div class="dataTables_scrollBody">
        <table class="table table-togglable table-hover">
          <thead>
            <tr>
              <th style="width: 100px" data-toggle="true">Kode</th>
              <th>Nama</th>
              <th style="width: 200px">Tipe Akun</th>
              <th class="text-center" style="width: 20px">#</th>
            </tr>
          </thead>
          <tbody>
            {#each $accountStore as account}
              <tr>
                <td>{account.code || ""}</td>
                <td>{account.name || ""}</td>
                <td>{getAccountType(account.type, $accountTypeStore)?.name || ""}</td>
                <td class="text-center">
                  <div class="list-icons">
                    <a href={$url('./post', { id: account.id })} class="list-icons-item"> <BarsIcon /> </a>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</PageLayout>
