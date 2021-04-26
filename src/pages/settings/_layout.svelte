<!--routify:options title="Pengaturan"-->
<script lang="ts">
  import { url, isActive } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "pengaturan" });

  let show = true;

  function togglerCollapseHandler() {
    show = !show;
  }
</script>

<PageLayout breadcrumb={[]}>
  <ul class="nav navbar-nav" slot="navbar-second">
    <li class="nav-item">
      <a
        href={$url("./")}
        class="navbar-nav-link"
        class:active={$isActive("./index")}
      >
        <i class="icon-user mr-2" />
        Profil
      </a>
    </li>
    <li class="nav-item">
      <a
        href={$url("./application")}
        class="navbar-nav-link"
        class:active={$isActive("./application")}
      >
        <i class="icon-wrench3 mr-2" />
        Aplikasi
      </a>
    </li>
    <li class="nav-item">
      <a
        href={$url("./users")}
        class="navbar-nav-link"
        class:active={$isActive("./users")}
      >
        <i class="icon-users mr-2" />
        User
      </a>
    </li>
    <li class="nav-item">
      <a
        href={$url("./cashier")}
        class="navbar-nav-link"
        class:active={$isActive("./cashier")}
      >
        <i class="icon-users4 mr-2" />
        Kasir
      </a>
    </li>
  </ul>
  <slot />
</PageLayout>
