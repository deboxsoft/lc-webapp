<!--routify:options title="menu"-->
<script lang="ts">
  import MenuOpen from "@deboxsoft/svelte-icons/MenuOpen.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import CardMenuContainer from "__@comps/CardMenuContainer.svelte";
  import CardMenu from "__@comps/CardMenu.svelte";
</script>

<PageLayout breadcrumb={[]}>
  <CardMenuContainer>
    <CardMenu label="Pencatatan" path="./pencatatan">
      <MenuOpen />
    </CardMenu>
    <CardMenu label="Penyusutan" path="./penyusutan" >
      <MenuOpen />
    </CardMenu>
  </CardMenuContainer>
</PageLayout>
