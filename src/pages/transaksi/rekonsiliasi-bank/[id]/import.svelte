<!--routify:options title="Import Rekening koran bank"-->
<script lang="ts">

  import { url, goto} from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Form from "./_comps/FormImportReconciliation.svelte";

  const { notify } = getApplicationContext();

  let fileLoaded = false;

  async function submitHandler({detail: values}) {

  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<PageLayout breadcrumb={{ title: 'Import Rekening Bank', path: $url('./import') }}>
  <div class="header-elements" slot="header-elements">
    <button type="button" on:click={() => $goto('./preview')} class="btn bg-blue-400 mr-2" disabled={!fileLoaded}><i class="icon-file-eye2 mr-2" />preview</button>
  </div>
  <div class="d-flex flex-column h-100">
    <Form on:submit={submitHandler} on:cancel={cancelHandler} bind:fileLoaded />
  </div>
</PageLayout>
