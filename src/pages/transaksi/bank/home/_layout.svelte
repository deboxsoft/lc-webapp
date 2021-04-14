<!--routify:options title=""-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import TableReconciliation from "./_components/TableBank.svelte";

</script>

<PageLayout breadcrumb={[]}>
  <div class="header-elements" slot="header-elements">
    <a href={$url('./form')} class="btn btn-primary btn-icon"><i class="fal fa-plus" /></a>
  </div>
  <div class="card d-flex flex-1">
    <div class="card-body d-flex flex-1">
      <TableReconciliation />
    </div>
  </div>
</PageLayout>
<slot />
