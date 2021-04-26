<script>
  import Table from "__@comps/Table.svelte";
  import { getUserContext } from "__@modules/users";
  import MenuUserList from "./_MenuUserList.svelte";

  const { userStore, find } = getUserContext();
  find();

</script>

<div class="card d-flex flex-1 flex-column">
  <div class="card-body d-flex flex-1">
    <Table items={$userStore} let:item={user}>
      <div class="dbx-thead" slot="header">
        <div class="dbx-cell username">username</div>
        <div class="dbx-cell">name</div>
        <div class="dbx-cell email">email</div>
        <!--        <div class="dbx-cell">role</div>-->
<!--        <div class="dbx-cell status">status</div>-->
        <div class="dbx-cell -menu-list" />
      </div>
      <div class="dbx-tr">
        <div class="dbx-cell username">{user.username || ""}</div>
        <div class="dbx-cell">{user.name || ""}</div>
        <div class="dbx-cell email">{user.email || ""}</div>
        <!--        <div class="dbx-cell">{user.roles && user.roles[0] || ""}</div>-->
<!--        <div class="dbx-cell status">{user.status || ""}</div>-->
        <div class="dbx-cell -menu-list" style="width: 30px">
          <MenuUserList id={user.id} />
        </div>
      </div>
    </Table>
  </div>
</div>
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
</style>
