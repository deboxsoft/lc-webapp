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
  import Table from "__@comps/tables/DataTable.svelte";
  import Button from "__@comps/Button.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";

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
    pageInfo,
    /** @type{import("@deboxsoft/accounting-api").RemainingContract[]} */
    dataList = [];
  fetchData();

  function fetchData(options = {}) {
    $loading = true;
    submitting = true;
    warningContract(
      {
        filter,
        pageCursor: {
          next: options.more && pageInfo?.next
        }
      },
      options
    ).then((response) => {
      pageInfo = response.pageInfo;
      const data = response.data
        .sort((a, b) => (dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1))
        .map((_) => ({
          ..._
        }));
      if (options.more) {
        dataList = [...dataList, ...data];
      } else {
        dataList = data;
      }
      $loading = false;
      submitting = false;
    });
  }

  function infiniteHandler() {
    fetchData({ more: true });
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
          <th>Nama</th>
          <th style="width: 150px">Tanggal Awal</th>
          <th style="width: 150px">Tanggal Akhir</th>
          <th style="width: 150px; text-align: center">Umur (Bulan)</th>
          <th style="width: 150px; text-align: center">Sisa Kontrak (Bulan)</th>
        </tr>
        {#each dataList as item}
          <tr>
            <!--            <td>{item.no || ""}</td>-->
            <td>{item.name || ""}</td>
            <td> <CellDate format="DD-MMMM-YYYY" date={item.dateStart} /></td>
            <td> <CellDate format="DD-MMMM-YYYY" date={item.dateEnd} /></td>
            <td style="text-align: center">{item.monthLife || "-"}</td>
            <td style="text-align: center">{item.remaining || "-"}</td>
          </tr>
        {/each}
      </Table>
      {#if pageInfo?.hasNext}
        <div class="" style="height: 50px">
          <Button class="btn btn-light w-100 text-uppercase" on:click={infiniteHandler} {submitting}
            ><i class="icon-chevron-down mr-2" />Muat Lebih Banyak...
          </Button>
        </div>
      {/if}
    </div>
  </div>
  <slot />
</PageLayout>
