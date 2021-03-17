<script lang="ts">
  import type {AccountInput} from "@deboxsoft/accounting-api"

  import { AccountInputSchema } from "@deboxsoft/accounting-api";
  import { createEventDispatcher } from "svelte";
  import SaveIcon from "__@comps/icons/Save.svelte";
  import AutoComplete from "__@comps/forms/AutoCompleteField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import { getAccountContext } from "__@modules/accounting";

  const { getAccountType, accountTypeStore } = getAccountContext();
  const dispatch = createEventDispatcher();

  export let values: Partial<AccountInput> = {};
  export let loading: boolean = false;

  /// handler
  function cancelHandler() {
    dispatch("cancel", values);
  }
</script>

<Form schema={AccountInputSchema} {values} on:submit>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-12">
          <label for="code">Kode</label>
          <InputField id="code" name="code" type="text" class="form-control" placeholder="Kode" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="name">Nama</label>
          <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="accountType">Jenis Akun</label>
          <AutoComplete
            id="accountType"
            name="type"
            valueFieldName="code"
            inputClassName="form-control"
            placeholder="Jenis Akun"
            items={$accountTypeStore}
            labelFunction={(accountType) => (accountType ? `${accountType.name}` : null)}
            keywordsFunction={(accountType) => (accountType ? `${accountType.name}` : null)} />
        </div>
      </div>
    </div>
    <div class="card-footer d-flex">
      <div class="flex-grow-1">&nbsp;</div>
      <div>
        <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={cancelHandler}>
          Cancel
        </button>
        <button type="submit" class="btn btn-primary ml-1" disabled={loading}>
          <SaveIcon class="mr-2" />
          Save
        </button>
      </div>
    </div>
  </div>
</Form>
