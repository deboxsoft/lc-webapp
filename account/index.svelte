<!--routify:options title="Akun Perkiraan"-->
<script lang="ts">
  import { url } from "@roxi/routify";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import AddTaskRoundedIcon from "@deboxsoft/svelte-icons/AddTaskRounded.svelte";
</script>

<PageLayout>
  <div class="header-elements" slot="header-elements">
    <a href={$url('/master/account/post')} class="btn btn-link btn-float text-default">
      <Icon class="text-primary" size="large" component={AddTaskRoundedIcon} />
      <span>Akun Baru</span></a>
  </div>
  <div class="card">
    <div class="card-header header-elements-inline">
      <h5 class="card-title">Akun Perkiraan</h5>
      <div class="header-elements">
        <div class="list-icons"><a class="list-icons-item" data-action="reload" /></div>
      </div>
    </div>
    <div class="card-body">
      <div class="dataTables_scrollBody">
        <table class="table table-togglable table-hover">
          <thead>
            <tr>
              <th class="fit" data-toggle="true">Kode</th>
              <th>Nama</th>
              <th class="fit">Tipe Akun</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  </div>
</PageLayout>
