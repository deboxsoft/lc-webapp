<script>
  import { derived } from "svelte/store";
  import { getUserContext } from "__@modules/users";

  const { groupStore } = getUserContext();

  export let id;
  const name = derived(groupStore, (_) => {
    const i = _.findIndex(__ => __.id === id);
    return _[i] && _[i].name;
  });
</script>
{$name || ""}
