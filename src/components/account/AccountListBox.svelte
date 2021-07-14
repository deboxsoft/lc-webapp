<script>
  import DualListBox from "../DualListBox.svelte";
  import { getFormContext } from "__@stores/form";
  import { stores } from "@deboxsoft/accounting-client";
  import { generateId } from "@deboxsoft/module-client";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const { getAccountsTree, accountStore } = stores.getAccountContext();

  export let id = generateId();
  export let name;
  export let selected = $fields && $fields[name];
  export let label = name;
  let options = [];
  let accountsTree = getAccountsTree();
  $: console.log($accountStore);
  $: {
    if ($accountsTree) {
      console.log($accountsTree);
      options = $accountsTree.map((_) => ({
        label: _.name,
        options: _.children.map((__) => ({
          label: __.name,
          value: __.id
        }))
      }));
    }
  }

  function changeHandler(selected) {
    if ($fields) {
      $fields[name] = selected;
    }
  }
</script>

<div class="label">
  <label for={id}>{label}</label>
  <div class="divide" />
</div>
<DualListBox
  {...$$restProps}
  {id}
  {name}
  options={options.length > 0 ? options : undefined}
  bind:values={selected}
  onChange={changeHandler}
  filterPlaceholder="cari akun perkiraan..."
  showHeaderLabels
  labelAvailable="Akun perkiraan yang Tersedia"
  labelSelected="Akun perkiraan yang dipilih"
/>

<style lang="scss">
  .label {
    font-weight: bold;
    flex: 1;
    display: flex;
    .divide {
      margin-left: 10px;
      flex: 1;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
      height: 15px;
    }
  }
</style>
