<script lang="ts">
  import type { SvelteComponentDev } from "svelte/internal";

  import { url } from "@roxi/routify";

  export let label: string = "";
  export let path: string = "./";
  export let icon: typeof SvelteComponentDev | undefined = undefined;
</script>

<style lang="scss" global>
  .card.card-menu {
    height: 300px;
    width: 300px;
    margin: 1rem;
    > a {
      padding-top: 1rem;
      color: #333;
      height: 100%;
      text-align: center;
    }
    > .card-body {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .card-body > .label {
      line-height: 24px;
      font-size: 20px;
      font-weight: 400;
      letter-spacing: 0.2px;
      height: 48px;
      margin-left: auto;
      margin-right: auto;
    }

    .card-body > .icon {
      max-width: 100%;
      width: 120px;
      height: 120px;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>

<div class="card-menu card">
  <a href={$url(path)}>
    <div class="card-body">
      <div class="label">{label}</div>
      <div class="icon">
        <slot />
      </div>
    </div>
  </a>
</div>
