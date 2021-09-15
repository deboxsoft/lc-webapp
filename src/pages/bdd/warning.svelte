<!--routify:options title="Sisa Kontrak"-->
<script>
  import { url, goto } from "@roxi/routify";
  import dayjs from "dayjs";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { createAclContext } from "./_acl-context";
  import { getApplicationContext } from "__@modules/app";
  import { createReportContext } from "./_export";
  import Table from "../../components/tables/DataTable.svelte";

  const { readGranted, createGranted } = createAclContext();
  const applicationContext = getApplicationContext();
  const reportContext = createReportContext();
  const { loading } = applicationContext;
  const { warningContract } = stores.getBddContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "sisa kontrak" });

  let submitting = false,
    filter = {},
    /** @type{import("@deboxsoft/accounting-api").RemainingContract[]} */
    dataList = [];
  fetchData();

  function fetchData() {
    $loading = true;
    submitting = true;
    warningContract().then((_) => {
      dataList = _;
      $loading = false;
      submitting = false;
    });
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    <a href="#/" target="_self" on:click={fetchData} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
  </svelte:fragment>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1 flex-column">
      <Table>
        <tr slot="header">
<!--          <th style="width: 70px">No</th>-->
          <th>Deskripsi</th>
          <th style="width: 150px">Tanggal Akhir</th>
          <th style="width: 150px; text-align: center">Sisa Kontrak (bulan)</th>
        </tr>
        {#each dataList as item}
          <tr>
<!--            <td>{item.no || ""}</td>-->
            <td>{item.description || ""}</td>
            <td> {item.dateEnd ? dayjs(item.dateEnd).format("DD-MMMM-YYYY") : ""}</td>
            <td style="text-align: center">{item.remaining || ""}</td>
          </tr>
        {/each}
      </Table>
    </div>
  </div>
  <slot />
</PageLayout>
