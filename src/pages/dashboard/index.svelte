<!--routify:options title="dashboard"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
</script>

<PageLayout breadcrumb={[]}>
  <div class="row">
    <div class="col-xl-7">
      <div class="card" style="height: 100%; width: 100%">
        <div class="card-header">
          <h5 class="card-title">Transaksi</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="d-flex align-items-center justify-content-center">
                <a href={$url("/transaksi/journal")}>Transaksi</a>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="d-flex align-items-center justify-content-center">
                <a href={$url("/transaksi/buku-besar")}>Buku Besar</a>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="d-flex align-items-center justify-content-center">
                <a href={$url("/transaksi/bank")}>Rekonsiliasi Bank</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-5">
      <div class="card" style="height: 100%; width: 100%">
        <div class="card-header">
          <h5 class="card-title">Pengikhtisaran</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-sm-6">
              <div class="d-flex align-items-center justify-content-center">
                <a href={$url("/pengikhtisaran/neraca")}>Neraca</a>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="d-flex align-items-center justify-content-center">
                <a href={$url("/pengikhtisaran/laba-rugi")}>Laba-Rugi</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</PageLayout>
