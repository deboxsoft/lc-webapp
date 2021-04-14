<!--routify:options title="Transaksi Baru"-->
<script lang="ts">
  import { goto } from "@roxi/routify";
  import { getTransactionContext, getAccountContext } from "__@modules/accounting";
  import { getUserContext } from "__@modules/users";
  import Modal
    from "__@comps/Modal.svelte";
  import FormJournal from "./_forms/FormJournal.svelte";

  // context
  const { user } = getUserContext();
  const { create, getTransaction } = getTransactionContext();
  const { accountStore } = getAccountContext();
  // form
  let transaction = {
    date: new Date(),
    type: "JOURNAL",
    total: 0,
    accounts: [{}],
    userId: $user.id
  };
  let loading: boolean = false;

  // handler
  async function submitHandler({ detail: values }) {
    loading = true;
    try {
      await create(values);
      loading = false;
      $goto("./");
    } catch (e) {
      loading = false;
    }
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<Modal title="Transaksi Baru" class="modal-lg">
  <div class="header-elements" slot="header-elements">
    <!--    <a href={$url('./')} class="btn btn-link btn-float text-default" target="_self">-->
    <!--      <Icon class="text-primary" size="large" component={SaveIcon} />-->
    <!--    </a>-->
  </div>
  <div class="d-flex flex-column h-100">
    <FormJournal
      values={transaction}
      {loading}
      on:submit={submitHandler}
      on:cancel={cancelHandler} />
  </div>
</Modal>
