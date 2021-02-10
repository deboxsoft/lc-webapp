<script lang="ts">
  import { FormStore } from "@deboxsoft/svelte-forms";
  import AutoComplete from "__@comps/AutoComplete.svelte";
  import Form from "@deboxsoft/svelte-forms/Form.svelte";
  import InputField from "@deboxsoft/svelte-forms/InputField.svelte";
  import { getAccountContext } from "__@modules/accounting";

  const { getAccountType, accountTypeStore } = getAccountContext();
  export let formStore: FormStore;

  const _initialObject = formStore?.getObjectValues() || {};
  let formEl: HTMLFormElement;
  function changeAccountValueHandler({ detail: value }) {
    if (value) {
      formStore.setValue("type", value.code);
      if (formStore.isTouched("type")) {
        formStore.validateField("type");
      }
    }
  }

</script>

<Form bind:formStore bind:ref={formEl}>
  <div class="form-group">
    <label for="code">Kode</label>
    <InputField id="code" name="code" type="text" class="form-control" placeholder="Kode" />
  </div>
  <div class="form-group">
    <label for="name">Nama</label>
    <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
  </div>
  <div class="form-group">
    <label for="accountType">Jenis Akun</label>
    <AutoComplete
      id="accountType"
      selectedItem={getAccountType(_initialObject.type)}
      on:change={changeAccountValueHandler}
      inputClassName="form-control"
      placeholder="Jenis Akun"
      items={$accountTypeStore}
      labelFunction={(accountType) => (accountType ? `${accountType.code} ${accountType.name}` : null)}
      keywordsFunction={(accountType) => (accountType ? `${accountType.code} ${accountType.name}` : null)} />
  </div>
</Form>
