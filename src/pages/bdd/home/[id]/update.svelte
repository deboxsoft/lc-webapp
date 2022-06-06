<!--routify:options title="Edit Data"-->
<script>
  import { BddUpdateInputSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import BddForm from "../../_components/BddForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";
  import Modal from "__@comps/Modal.svelte";
  import { onMount } from "svelte";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { update, bddStore, getBdd } = stores.getBddContext();
  const { notify, loading: topLoading } = getApplicationContext();
  let openDialog,
    fields,
    isValid,
    submitting = false;
  const schema = BddUpdateInputSchema;
  onMount(() => {
    openDialog();
  });

  $: to = $params.to || "../";
  $: bdd = $bddStore && getBdd($params.id);

  async function submitHandler() {
    try {
      $topLoading = true;
      submitting = true;
      const input = schema.parse($fields);
      await update($params.id, input);
      closeHandler();
      notify(`Berhasil mengedit data bdd ${input.name}`, "success");
    } catch (error) {
      console.error(error);
      notify(`${error.message}`, "error");
    } finally {
      submitting = false;
      $topLoading = false;
    }
  }

  function closeHandler() {
    $goto($params.to || "../");
  }
</script>

<Modal class="modal-lg" bind:openDialog title="Edit BDD" loading={!bdd}>
  <BddForm {bdd} {schema} bind:isValid bind:fields />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Tutup
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={!$isValid || submitting} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Simpan
    </button>
  </svelte:fragment>
</Modal>
