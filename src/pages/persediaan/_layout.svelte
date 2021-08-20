<!--routify:options title="Persediaan"-->
<script>
  import Table from "./_components/TableStock.svelte";
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2 mr-1" />
        Posting
      </a>
    {/if}
  </svelte:fragment>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1 flex-column">
      <Table />
    </div>
  </div>
  <slot />
</PageLayout>
