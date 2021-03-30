<script>
  import {goto, params} from "@roxi/routify"
  import Modal from "__@comps/Modal.svelte";
  import { getTransactionContext } from "__@modules/accounting";

  const { getTransaction } = getTransactionContext();

  export let to = "../"

  $: transaction = getTransaction($params.id);

  function closeHandler() {
    $goto(to)
  }
</script>

<Modal title="Detail Transaksi {$transaction? `'${$transaction.id}'` : ''}" class="modal-lg">
  <svelte:fragment>
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
