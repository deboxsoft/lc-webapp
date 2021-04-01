<script>
  import { derived, writable } from "svelte/store";
  import { utils } from "@deboxsoft/module-core";
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getAccountContext, getBalanceContext } from "__@modules/accounting";

  const { keys, getStore, setValues } = getBalanceContext();
  const { accountStore } = getAccountContext();
  let key = writable(keys[0]);
  let balanceAccountValues = getStore(keys[0]);
  $: url = $params.backUrl || "./";
  $: accounts = derived(accountStore, (_) => _);

  function addSelectedHandler(e) {
    setValues($key, $balanceAccountValues);
  }

  function menuSelectedHandler(e) {
    balanceAccountValues = getStore($key);
  }

  async function saveHandler() {
    // await save(accountId);
    $goto(url, {}, true);
  }

  function closeHandler() {
    $goto(url, {}, true);
  }
</script>

<Modal class="modal-lg" open title="Pengaturan Aplikasi Akunting">
  <form>
    <div class="row">
      <div class="container">
        <class class="form-group col-12">
          <select class="form-control" bind:value={$key} on:change={menuSelectedHandler}>
            {#each keys as _key}
              <option value={_key}>{utils.sentenceCase(_key)}</option>
            {/each}
          </select>
        </class>
      </div>
    </div>
    <div class="bootstrap-duallistbox-container row moveonselect">
      <div class="box1 col-12">
        <select
          multiple
          class="form-control"
          style="height: 200px"
          on:click={addSelectedHandler}
          bind:value={$balanceAccountValues}
        >
          {#each $accounts as account}
            <option value={account.id}>{account.name}</option>
          {/each}
        </select>
      </div>
      <!--      <div class="box1 col-md-6">-->
      <!--        <select multiple class="form-control" style="height: 200px" on:select={removeHandler}>-->
      <!--          <option />-->
      <!--        </select>-->
      <!--      </div>-->
    </div>
  </form>
  <svelte:fragment slot="footer">
    <button class="btn btn-link text-primary" on:click={closeHandler}>Tutup</button>
    <button class="btn bg-primary" on:click={saveHandler}>Simpan</button>
  </svelte:fragment>
</Modal>
