<script lang="ts">
  import InputCheck from "__@comps/InputCheck.svelte";
  import InputRp from "../../components/InputRp.svelte";
  import { getContext } from "svelte";

  let checkListTypeAmount = [
    {
      label: "Debet",
      value: 1
    },
    {
      label: "Kredit",
      value: -1
    }
  ];

  export let account;

  let typeAmount: number = -1;
  let amount;

  const { handleClose } = getContext("modal");
</script>

<div class="modal-content">
  <div class="modal-header">
    <h5 class="modal-title">Detail Akun</h5>
    <button type="button" class="close" data-dismiss="modal" on:click={handleClose}>x</button>
  </div>
  <form class="form-horizontal">
    <div class="modal-body">
      <div class="form-group row">
        <div class="col-form-label col-sm-3">Akun Perkiraan</div>
        <div class="col-sm-9"><input class="form-control-plaintext" readonly value={account.name} /></div>
      </div>
      <div class="form-group row">
        <label class="col-form-label col-sm-3">Jenis</label>
        <div class="col-sm-9">
          <InputCheck name="typeAmount" type="radio" checkList={checkListTypeAmount} bind:value={typeAmount} />
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-3" />
        <div class="col-sm-9">
          <label>
            <InputRp bind:value={amount} /></label>
        </div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn bg-primary">Add</button></div>
  </form>
</div>
