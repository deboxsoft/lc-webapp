<script>
  import i from "initials";
  import Loader from "__@comps/loader/Loader.svelte";

  export let style = "";
  export let initials = undefined;
  export let label = "";
  export let src;
  export let bgColor = "#cccccc";
  export let textColor = "white";
  export let size = "50px";
  export let borderRadius = "50%";
  export let square = false;
  export let randomBgColor = false;
  export let loading = false;
  export let initialDisable = false;
  const background = bgColor;
  let { class: className = "" } = $$props;

  export let imageFail = false;
  let imageLoading = true;
  let abbr, abbrLength;

  $: {
    abbr = initials || i(label).toUpperCase();
    abbrLength = abbr.length;
  }
  $: srcImg = src;
</script>

<div
  aria-label={label}
  class="wrapper {className}"
  style="{style}--borderRadius:{square ? 0 : borderRadius}; --size:{size}; --bgColor:{background};
  --src:{src}; --textColor:{textColor}; --abbrLength:{abbrLength}"
>
  {#if loading}
    <Loader />
  {:else}
    {#if srcImg && !imageFail}
      <div class={imageLoading ? "imageLoading" : ""}>
        <img
          alt=""
          class={`innerImage`}
          src={srcImg}
          on:error={() => {
            imageLoading = false;
            imageFail = true;
          }}
          on:load={() => {
            imageFail = false;
            imageLoading = false;
          }}
        />
      </div>
    {:else if !initialDisable}
      <div class="innerInitials">{abbr}</div>
    {/if}
    <slot />
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
    width: var(--size);
    height: var(--size);
  }
  .innerImage,
  .innerInitials,
  .imageLoading {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: var(--borderRadius);
  }
  .innerInitials {
    line-height: var(--size);
    background-color: var(--bgColor);
    color: var(--textColor);
    text-align: center;
    font-size: calc(var(--size) / (var(--abbrLength) + 0.5));
  }
  .imageLoading {
    background-color: var(--bgColor);
  }
  .imageLoading::before {
    content: "";
    display: block;
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, transparent, #ffffff38, transparent);
    position: absolute;
    top: 0;
    left: 0;
    animation: skeleton-animation 1.2s linear infinite;
  }
  @keyframes skeleton-animation {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
