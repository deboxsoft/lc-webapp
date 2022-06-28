<!--routify:options title="Posting Bdd"-->
<script>
  import { BddInputSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import BddForm from "../_components/BddForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import dayjs from "dayjs";
  import Modal from "__@comps/Modal.svelte";
  import { goto, params } from "@roxi/routify";

  const { getUserId } = getAuthenticationContext();
  const { notify, loading: topLoading } = getApplicationContext();
  const { create } = stores.getBddContext();

  let openDialog,
    fields,
    isValid,
    submitting = false;
  const schema = BddInputSchema;

  const now = new Date();
  const bdd = {
    date: now,
    dateStart: now,
    dateEnd: dayjs().add(1, "year").toDate(),
    userId: getUserId(),
    monthLife: 24
  };
  $: {
    if (openDialog) {
      openDialog();
    }
  }

  async function submitHandler() {
    try {
      $topLoading = true;
      submitting = true;
      const input = schema.parse($fields);
      await create(input);
      closeHandler();
      notify(`Berhasil membuat data bdd ${input.name}`, "success");
    } catch (error) {
      console.error(error);
      notify(`${error.message}`, "error");
    } finally {
      submitting = false;
      $topLoading = false;
    }
  }
  function closeHandler() {
    $goto($params.to || "./");
  }
</script>

<Modal class="modal-lg" bind:openDialog title="Posting BDD" loading={!bdd}>
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
