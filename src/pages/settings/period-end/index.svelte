<script>
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { goto, url } from "@roxi/routify";
  import { createAclContext } from "__@root/pages/settings/_acl-context";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { z } from "@deboxsoft/zod";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import dayjs from "dayjs";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Periode Akhir Tahun" });
  const { updateGranted } = createAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { periodEnd } = stores.getTransactionContext();

  const schema = z.object({
    period: z.string()
  })

  async function processPeriodEndHandler() {
    $goto("./confirm", { period: dayjs().year()});
  }
</script>

<PageLayout breadcrumb={[]} >
  <div class="card">
    <div class="card-body">
      Proses Akhir Tahun {dayjs().year()}
    </div>
    <div class="card-footer bg-white text-right">
      <button class="btn bg-primary" on:click={processPeriodEndHandler}>Proses</button>
    </div>
  </div>
</PageLayout>