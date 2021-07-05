<script>
  import { goto } from "@roxi/routify";
  import Table from "__@comps/Table.svelte";
  import { getUserContext } from "__@modules/users";
  import MenuUserList from "./_MenuUserList.svelte";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "__@comps/loader/Loader.svelte";
  import GroupName from "../group/_groupName.svelte";
  import { createAclContext } from "../_acl-context";

  const { readUserGranted } = createAclContext();
  const { loading } = getApplicationContext();
  const { userStore, groupStore } = getUserContext();

  if (!readUserGranted) {
    $goto("/access-denied");
  }
  function getGroup(id) {
    const i = $groupStore.findIndex((_) => _.id === id);
    return $groupStore[i];
  }
</script>

{#if $loading}
  <Loader />
{:else}
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1">
      <Table items={$userStore} let:item={user}>
        <div class="dbx-thead" slot="header">
          <div class="dbx-cell username">Username</div>
          <div class="dbx-cell">Nama</div>
          <div class="dbx-cell email">Email</div>
          <div class="dbx-cell group">Group</div>
          <!--        <div class="dbx-cell status">status</div>-->
          <div class="dbx-cell -menu-list" />
        </div>
        <div class="dbx-tr">
          <div class="dbx-cell username">{user.username || ""}</div>
          <div class="dbx-cell">{user.name || ""}</div>
          <div class="dbx-cell email">{user.email || ""}</div>
          <div class="dbx-cell group"><GroupName id={user.groupId} /></div>
          <!--        <div class="dbx-cell status">{user.status || ""}</div>-->
          <div class="dbx-cell -menu-list" style="width: 30px">
            <MenuUserList id={user.id} />
          </div>
        </div>
      </Table>
    </div>
  </div>
{/if}
<slot />

<style lang="scss">
  .username {
    flex: 0 0 200px;
  }

  .email {
    flex: 0 0 200px;
  }

  .status {
    flex: 0 0 100px;
  }

  .group {
    flex: 0 0 150px;
  }
</style>
