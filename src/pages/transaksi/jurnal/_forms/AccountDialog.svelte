<script lang="ts">
  import type { JournalAccount, JournalAccountInput } from "@deboxsoft/accounting-api";
  import type { FormStore } from "@deboxsoft/svelte-forms";
  import InputCheck from "__@comps/InputCheck.svelte";
  import InputRp from "__@comps/InputRp.svelte";
  import { getContext, createEventDispatcher } from "svelte";

  let checkListTypeAmount = [
    {
      label: "Debit",
      value: 1
    },
    {
      label: "Kredit",
      value: -1
    }
  ];
  export let journalAccount: Partial<JournalAccount>;
  export let index: number | undefined = undefined;
  const { account, ...journalAccountInput } = journalAccount;
  const dispatch = createEventDispatcher();

  const { handleClose } = getContext("modal");

  function submitHandler() {
    dispatch("submit", {
      index,
      journalAccount: {
        account,
        ...journalAccountInput
      }
    });
    handleClose();
  }
</script>

<div class="modal-content">
  <div class="modal-header">
    <h5 class="modal-title">Detail Akun</h5>
<!--    <button type="button" class="close" data-dismiss="modal" on:click={handleClose}>x</button>-->
  </div>
  <form class="form-horizontal">
    <div class="modal-body">
      <div class="form-group row">
        <div class="col-form-label col-sm-3">Akun Perkiraan</div>
        <div class="col-sm-9">
          <input class="form-control-plaintext" readonly value={account.name} />
        </div>
      </div>
      <div class="form-group row">
        <label for="type-amount-dialog" class="col-form-label col-sm-3">Jenis</label>
        <div class="col-sm-9">
          <InputCheck
            id="type-amount-dialog"
            name="typeAmount"
            type="radio"
            defaultValue={1}
            checkList={checkListTypeAmount}
            bind:value={journalAccountInput.typeAmount} />
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-3" />
        <div class="col-sm-9">
          <label for="amount-dialog">
            <InputRp id="amount-dialog" name="amount" bind:value={journalAccountInput.amount} /></label>
        </div>
      </div>
    </div>
    <div class="modal-footer"><button type="button" class="btn bg-primary" on:click={submitHandler}>Add</button></div>
  </form>
</div>
